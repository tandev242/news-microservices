const { Server } = require('socket.io')
const { addUser, removeUser, getUser, updateUser } = require('./usersSocket')

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })
  io.on('connection', (socket) => {
    socket.on('join', async ({ room, avatar, name }, callback) => {
      try {
        const user = await addUser({ id: socket.id, avatar, room, name })
        socket.join(user.room)
        io.emit('message', {
          user: 'admin',
          text: `${user.name},welcome to the room ${user.room}`,
        })
        socket.broadcast
          .to(user.room)
          .emit('message', { user: 'admin', text: `${user.name}, has joined!` })
        // callback()
      } catch (error) {
        console.log(error)
      }
    })
    socket.on('userAddTopicComment', async ({ topicComment }, callback) => {
      try {
        const user = await getUser(socket.id)
        if (!user.name) return
        socket.broadcast.to(user.room).emit('addTopicComment', { topicComment })
      } catch (error) {
        console.log(error)
      }
    })
    socket.on('userAddPostComment', async ({ postComment }, callback) => {
      try {
        const user = await getUser(socket.id)
        if (!user.name) return
        socket.broadcast.to(user.room).emit('addPostComment', { postComment })
      } catch (error) {
        console.log(error)
      }
    })
    socket.on('updateUser', async ({ avatar, name }, calback) => {
      await updateUser(socket.id, name, avatar)
    })

    socket.on('userAddSubComment', async ({ reply, type }) => {
      try {
        const user = await getUser(socket.id)
        if (!user.name) return
        socket.broadcast.to(user.room).emit('addSubComment', { reply, type })
      } catch (error) {
        console.log(error)
      }
    })

    socket.on('disconnect', async () => {
      await removeUser(socket.id)
    })
  })
}
