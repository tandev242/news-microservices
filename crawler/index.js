const express = require('express')
require('dotenv').config()
const Request = require('request')
const mongoose = require('mongoose')
const cheerio = require('cheerio')
const fs = require('fs').promises
var cron = require('node-cron')
const Posts = require('./post.model')
const Categories = require('./category.model')

const kafka = require('kafka-node')
const Producer = kafka.Producer
const client = new kafka.KafkaClient({ kafkaHost: '127.0.0.1:9092' })
const producer = new Producer(client)
const topic = 'post'

producer.on('ready', () => {
  console.log('connected')
})

const app = express()

try {
  mongoose.connect('mongodb://localhost:27017/crawl', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('Connected to database')
} catch (error) {
  console.log(error)
}

// Get list post
async function getListPost(link) {
  return new Promise((resolve, reject) => {
    Request(
      {
        method: 'GET',
        url: link,
      },
      function (err, response, body) {
        if (err) reject(err)
        resolve(JSON.parse(body))
      }
    )
  })
}

// Get post content
async function getContent(link) {
  return new Promise(async (resolve, reject) => {
    Request(
      {
        method: 'GET',
        url: link,
      },
      function (err, response, body) {
        if (err) reject(err)
        if (!body || typeof body !== 'string') {
          reject(new Error("Can' load url"))
        } else {
          const $ = cheerio.load(body)
          var content = $(
            'body > section.section.page-detail.top-detail > div > div.sidebar-1 > article'
          ).html()
          resolve(content)
        }
      }
    )
  })
}

let listParentCategory = [
  {
    categoryId: '1001005',
    name: 'Thời sự',
  },
  {
    categoryId: '1003450',
    name: 'Góc nhìn',
  },
  {
    categoryId: '1001002',
    name: 'Thế giới',
  },
  {
    categoryId: '1003159',
    name: 'Kinh doanh',
  },
  {
    categoryId: '1001009',
    name: 'Khoa học',
  },
  {
    categoryId: '1002691',
    name: 'Giải trí',
  },
  {
    categoryId: '1001007',
    name: 'Pháp luật',
  },
  {
    categoryId: '1003497',
    name: 'Giáo dục',
  },
  {
    categoryId: '1001012',
    name: 'Ý kiến',
  },
]

// Save list parent category
// (async () => {
//     try {
//         await Categories.create(listParentCategory);
//     } catch (error) {
//         if (error.code !== 11000) {
//             console.log(error);
//         }
//     }
// })();

// crawl function
const crawl = async (category_id) => {
  // let category_id = "1001002";
  let limit = '1000'
  let link = `https://gw.vnexpress.net/mv?site_id=1000000&category_id=${category_id}&type=1&limit=${limit}&data_select=article_id,article_type,title,share_url,thumbnail_url,publish_time,lead,privacy,original_cate,article_category`
  try {
    const listPost = await getListPost(link)

    if (
      listPost.data[category_id].data &&
      listPost.data[category_id].data !== []
    ) {
      Promise.all(
        listPost.data[category_id].data.map((e) => {
          return new Promise(async (resolve, reject) => {
            let content = await getContent(e.share_url)

            e.content = content

            resolve(e)
          })
        })
      ).then(async (values) => {
        try {
          const postList = values.map((e) => {
            let newPost = {
              publish_time: e.publish_time,
              title: e.title,
              postId: e.article_id,
              categoryId: e.original_cate,
              lead: e.lead,
              thumbnail_url: e.thumbnail_url,
              content: e.content,
            }
            return newPost
          })
          producer.send(
            [{ topic: 'post', messages: postList[0] }],
            function (err, data) {
              console.log(data)
            }
          )
          //   const listCate = values.map((e) => {
          //     let newCate = {
          //       categoryId: e.original_cate,
          //       name: e.article_category.cate_name,
          //       parent_id: e.article_category.full_parent,
          //     }
          //     return newCate
          //   })

          //   await Categories.create(listCate)
        } catch (error) {
          if (error.code !== 11000) {
            console.log(error)
          }
        }
      })
    }
    // for (let e of listPost.data[category_id].data) {
    //     let content = await getContent(e.share_url);

    //     e.content = content;

    //     let newObj = {
    //         publish_time: e.publish_time,
    //         title: e.title,
    //         postId: e.article_id,
    //         categoryId: e.original_cate,
    //         lead: e.lead,
    //         thumbnail_url: e.thumbnail_url,
    //         content: e.content,
    //     };

    //     try {
    //         await new Posts(newObj).save();
    //     } catch (error) {
    //         if (error.code !== 11000) {
    //             console.log(error);
    //         }
    //     }

    //     let newCate = {
    //         categoryId: e.original_cate,
    //         name: e.article_category.cate_name,
    //         parent_id: e.article_category.full_parent,
    //     };

    //     try {
    //         await new Categories(newCate).save();
    //     } catch (error) {
    //         if (error.code !== 11000) {
    //             console.log(error);
    //         }
    //     }
    // }

    // await fs.writeFile(
    //     "data.json",
    //     JSON.stringify(listPost.data[category_id].data)
    // );
  } catch (error) {
    console.log(error)
  }
}

;(async () => {
  console.log('Update post & category at 22:40 at Asia/Ho_Chi_Minh timezone')
  Promise.all(
    listParentCategory.map(async (e) => {
      await crawl(e.categoryId)
    })
  )
})()

// crawl all
// cron.schedule(
//   '26 10 * * *',
//   async () => {
//     console.log('Update post & category at 22:40 at Asia/Ho_Chi_Minh timezone')
//     Promise.all(
//       listParentCategory.map(async (e) => {
//         await crawl(e.categoryId)
//       })
//     )
//   },
//   {
//     scheduled: true,
//     timezone: 'Asia/Ho_Chi_Minh',
//   }
// )

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server is listening at ' + PORT)
})
