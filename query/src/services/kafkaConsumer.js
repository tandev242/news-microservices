const kafka = require('kafka-node')
const Consumer = kafka.Consumer
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_URL })
const Posts = require('../models/post.model')
const Category = require('../models/category.model')
const User = require('../models/user.model')
const PostComment = require('../models/postComment.model')
const TopicComment = require('../models/topicComment.model')
const slugify = require('slugify')

// Create topic
var topicsToCreate = [
  {
    topic: 'post',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'category',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'createPost',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'updatePost',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'deletePost',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'createCategory',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'updateCategory',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'deleteCategory',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'createUser',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'updateUser',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'addPostComment',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'addSubPostComment',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'addTopicComment',
    partitions: 1,
    replicationFactor: 1,
  },
  {
    topic: 'addSubTopicComment',
    partitions: 1,
    replicationFactor: 1,
  },
]

const option = {
  groupId: 'kafka-node-group', //consumer group id, default `kafka-node-group`
  // Auto commit config
  autoCommit: true,
  autoCommitIntervalMs: 5000,
  // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
  fetchMaxWaitMs: 100,
  // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
  fetchMinBytes: 1,
  // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
  fetchMaxBytes: 1024 * 1024,
  // If set true, consumer will fetch message from the given offset in the payloads
  fromOffset: false,
  // If set to 'buffer', values will be returned as raw buffer objects.
  encoding: 'utf8',
  keyEncoding: 'utf8',
}

client.on('ready', () => {
  client.createTopics(topicsToCreate, (error, result) => {
    if (error) {
      console.log(error)
    }
    if (result) {
      console.log('Topic started successfully')
    }
  })
  console.log('POST has connected to kafka')
})

const consumer = new Consumer(
  client,
  [
    { topic: 'post' },
    { topic: 'category' },
    { topic: 'createPost' },
    { topic: 'updatePost' },
    { topic: 'deletePost' },
    { topic: 'createCategory' },
    { topic: 'updateCategory' },
    { topic: 'deleteCategory' },
    { topic: 'createUser' },
    { topic: 'updateUser' },
    { topic: 'addPostComment' },
    { topic: 'addSubPostComment' },
    { topic: 'addTopicComment' },
    { topic: 'addSubTopicComment' },
  ],
  option
)
consumer.on('message', async (message) => {
  // console.log(Object.keys(message.value))
  switch (message.topic) {
    case 'category':
      const categoryList = JSON.parse(message.value)
      try {
        await Category.create(categoryList)
      } catch (error) {
        if (error.code !== 11000) {
          console.log(error)
        }
      }
      break
    case 'post':
      const postList = JSON.parse(message.value)
      try {
        await Posts.create(postList)
      } catch (error) {
        if (error.code !== 11000) {
          console.log(error)
        }
      }
      break
    case 'createPost':
      console.log('create post')
      try {
        const { postId, title, categoryId, lead, content, thumbnailUrl } =
          JSON.parse(message.value)
        let slug = slugify(title, {
          remove: undefined, // remove characters that match regex, defaults to `undefined`
          lower: true, // convert to lower case, defaults to `false`
          strict: true, // strip special characters except replacement, defaults to `false`
          locale: 'vi', // language code of the locale to use
          trim: true, // trim leading and trailing replacement chars, defaults to `true`
        })

        const newPost = new Posts({
          _id: postId,
          title,
          categoryId,
          slug,
          lead,
          content,
          thumbnailUrl,
        })
        await newPost.save()
        console.log(newPost)
      } catch (error) {
        console.log(error)
      }
      break
    case 'updatePost':
      console.log('update post')
      try {
        const { update, postId } = JSON.parse(message.value)

        await Posts.updateOne({ _id: postId }, { $set: { ...update } })
      } catch (error) {
        console.log(error)
      }
      break
    case 'deletePost':
      console.log('delete post')
      try {
        const { postId } = JSON.parse(message.value)

        await Posts.deleteOne({ _id: postId })
      } catch (error) {
        console.log(error)
      }
      break
    case 'createCategory':
      console.log('create category')
      try {
        const { categoryId, slug, name, parentId } = JSON.parse(message.value)

        const newCategory = new Category({
          _id: categoryId,
          slug,
          name,
          parentId,
        })
        await newCategory.save()
      } catch (error) {
        console.log(error)
      }
      break
    case 'updateCategory':
      console.log('update category')
      let { categoryId, update } = JSON.parse(message.value)

      await Category.updateOne({ _id: categoryId }, { $set: { ...update } })
      break
    case 'deleteCategory':
      console.log('delete category')
      const msg = JSON.parse(message.value)

      await Category.deleteOne({ _id: msg.categoryId })
      break
    case 'createUser':
      try {
        const { newUser } = JSON.parse(message.value)
        await User.create(newUser)
      } catch (error) {
        console.log(error)
      }

      break
    case 'updateUser':
      try {
        const { newUser } = JSON.parse(message.value)
        await User.updateOne({ _id: newUser._id }, { ...newUser })
      } catch (error) {
        console.log(error)
      }
      break
      case 'addPostComment':
      console.log('Add postComment')
      try {
        let { postComment } = JSON.parse(message.value)
        // receive new postComment and save to db
        await PostComment.create(postComment)
      } catch (error) {
        console.log(error)
      }
      break
    case 'addSubPostComment':
      console.log('Add subPostComment')
      try {
        const { _id, content, userId } = JSON.parse(message.value)
        await PostComment.updateOne(
          { _id },
          {
            $push: { subComments: { userId, content } },
          },
          { new: true, upsert: true }
        )
      } catch (error) {
        console.log(error)
      }
      break

    case 'addTopicComment':
      console.log('Add TopicComment')
      try {
        let { topicComment } = JSON.parse(message.value)
        // receive new postComment and save to db
        await TopicComment.create(topicComment)
      } catch (error) {
        console.log(error)
      }
      break
    case 'addSubTopicComment':
      console.log('Add subTopicComment')
      try {
        const { _id, content, userId } = JSON.parse(message.value)
        await TopicComment.updateOne(
          { _id },
          { $push: { subComments: { userId, content } } },
          { new: true, upsert: true }
        )
      } catch (error) {
        console.log(error)
      }
      break

    default:
      break
  }
})
