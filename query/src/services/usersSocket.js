const redis = require('redis')
const users = redis.createClient()
const addUser = async ({ id, avatar, room, name }) => {
  return new Promise((resolve, reject) => {
    const object = JSON.stringify({ avatar, room, name })
    users.set(id, object, async (error, reply) => {
      if (error) {
        reject(error)
      }
      const user = await getUser(id)
      resolve(user)
    })
  })
}
const removeUser = (id) => {
  return new Promise((resolve, reject) => {
    users.del(id, (error, reply) => {
      if (error) {
        reject(error)
      }
      resolve(reply)
    })
  })
}
const getUser = (id) => {
  return new Promise((resolve, reject) => {
    users.get(id, (error, reply) => {
      if (error) {
        reject(error)
      }
      resolve(JSON.parse(reply))
    })
  })
}

const updateUser = (id, name, avatar) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await getUser(id)
      user.name = name
      user.avatar = avatar
      users.set(id, JSON.stringify(user), (error, reply) => {
        if (error) {
          reject(error)
        }
        resolve(reply)
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = { addUser, removeUser, getUser, updateUser }
