const Request = require("request");
const cheerio = require("cheerio");
var cron = require("node-cron");
const slugify = require("slugify");

const kafka = require("kafka-node");
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: "127.0.0.1:9092" });
const producer = new Producer(client);

// Get list post
async function getListPost(link) {
  return new Promise((resolve, reject) => {
    Request(
      {
        method: "GET",
        url: link,
      },
      function (err, response, body) {
        if (err) reject(err);
        resolve(JSON.parse(body));
      }
    );
  });
}

// Get post content
async function getContent(link) {
  return new Promise(async (resolve, reject) => {
    Request(
      {
        method: "GET",
        url: link,
      },
      function (err, response, body) {
        if (err) {
          console.log(err);
          reject(err);
        }
        // console.log(body);
        if (typeof body !== "string") {
          console.log("Can't load url");
          // reject(new Error("Can' load url"));
        } else {
          const $ = cheerio.load(body);
          var content = String(
            $(
              "body > section.section.page-detail.top-detail > div > div.sidebar-1 > article"
            ).html()
          );

          resolve(content);
        }
      }
    );
  });
}

let listParentCategory = [
  {
    categoryId: "1001005",
    name: "Thời sự",
  },
  {
    categoryId: "1003450",
    name: "Góc nhìn",
  },
  {
    categoryId: "1001002",
    name: "Thế giới",
  },
  {
    categoryId: "1001009",
    name: "Khoa học",
  },
  {
    categoryId: "1001007",
    name: "Pháp luật",
  },
  {
    categoryId: "1003497",
    name: "Giáo dục",
  },
  {
    categoryId: "1001012",
    name: "Ý kiến",
  },
];

// crawl function
const crawl = async (category_id) => {
  let limit = "50";
  let link = `https://gw.vnexpress.net/mv?site_id=1000000&category_id=${category_id}&type=1&limit=${limit}&data_select=article_id,article_type,title,share_url,thumbnail_url,publish_time,lead,privacy,original_cate,article_category`;
  try {
    const listPost = await getListPost(link);
    if (listPost.data[category_id].data) {
      for (let el of listPost.data[category_id].data) {
        if (el.share_url) {
          var content = await getContent(el.share_url);
          // console.log(el);
          
          content = content.replaceAll('"', "'");
          content = content.replaceAll("amp;", "");
          content = content.replaceAll("src", "src1");
          content = content.replaceAll("data-src1", "src");

          content = content.replaceAll("src1=\'http", "src=\'http");

          el.content = content;
        }
      }
      const postList = listPost.data[category_id].data.map((e) => {
        let newPost = {
          title: e.title,
          _id: e.article_id,
          slug: slugify(e.title, {
            remove: undefined, // remove characters that match regex, defaults to `undefined`
            lower: true, // convert to lower case, defaults to `false`
            strict: true, // strip special characters except replacement, defaults to `false`
            locale: "vi", // language code of the locale to use
            trim: true, // trim leading and trailing replacement chars, defaults to `true`
          }),
          categoryId: e.original_cate,
          lead: e.lead,
          thumbnailUrl: e.thumbnail_url,
          content: e.content,
        };
        return newPost;
      });

      producer.send(
        [{ topic: "post", messages: JSON.stringify(postList) }],
        function (err, data) {
          // console.log(data);
        }
      );

      const listCate = listPost.data[category_id].data.map((e) => {
        let newCate = {
          _id: e.original_cate,
          name: e.article_category.cate_name,
          parentId: e.article_category.full_parent,
          slug: e.article_category.cate_url,
        };
        return newCate;
      });

      producer.send(
        [{ topic: "category", messages: JSON.stringify(listCate) }],
        function (err, data) {
          // console.log(data);
        }
      );
    }
    // Promise.all(
    //     listPost.data[category_id].data.map((e) => {
    //         if (e.share_url) {
    //             return new Promise(async (resolve, reject) => {
    //                 try {
    //                     var content = await getContent(e.share_url);
    //                 } catch (error) {
    //                     console.log(error);
    //                 }

    //                 e.content = content;

    //                 resolve(e);
    //             });
    //         }
    //     })
    // ).then(async (values) => {
    //     try {
    //         const postList = values.map((e) => {
    //             let newPost = {
    //                 publish_time: e.publish_time,
    //                 title: e.title,
    //                 _id: e.article_id,
    //                 categoryId: e.original_cate,
    //                 lead: e.lead,
    //                 thumbnail_url: e.thumbnail_url,
    //                 content: e.content,
    //             };
    //             return newPost;
    //         });
    //         // console.log(postList);
    //         producer.send(
    //             [{ topic: "post", messages: JSON.stringify(postList) }],
    //             function (err, data) {
    //                 console.log(data);
    //             }
    //         );

    //         const listCate = values.map((e) => {
    //             let newCate = {
    //                 _id: e.original_cate,
    //                 name: e.article_category.cate_name,
    //                 parent_id: e.article_category.full_parent,
    //                 slug: e.article_category.cate_url
    //             };
    //             return newCate;
    //         });

    //         producer.send(
    //             [{ topic: "category", messages: JSON.stringify(listCate) }],
    //             function (err, data) {
    //                 console.log(data);
    //             }
    //         );

    //     } catch (error) {
    //         if (error.code !== 11000) {
    //             console.log(error);
    //         }
    //     }
    // });
  } catch (error) {
    if (error.code !== 11000) {
      console.log(error);
    }
  }
};

(async () => {
  try {
    console.log("Crawler is starting");
    // Promise.all(
    listParentCategory.map(async (e) => {
      await crawl(String(e.categoryId));
    });
    // );
  } catch (error) {
    console.log(error);
  }
})();
// crawl all
// cron.schedule(
//     "45 11 * * *",
//     async () => {
//         console.log(
//             "Update post & category at 22:40 at Asia/Ho_Chi_Minh timezone"
//         );
//         Promise.all(
//             listParentCategory.map(async (e) => {
//                 await crawl(e.categoryId);
//             })
//         );
//     },
//     {
//         scheduled: true,
//         timezone: "Asia/Ho_Chi_Minh",
//     }
// );
