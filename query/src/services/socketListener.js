const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const {
  addUser,
  removeUser,
  getUsers,
  getUsersInRoom,
  updateUser,
} = require('./usersSocket')

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })
  io.on('connection', (socket) => {
    console.log('a user connected', socket.id)

    socket.on('join', ({ room, avatar, name }, callback) => {
      const user = addUser({ id: socket.id, avatar, room, name })

      socket.join(user.room)
      socket.emit('message', {
        user: 'admin',
        text: `${user.name},welcome to the room ${user.room}`,
      })
      socket.broadcast
        .to(user.room)
        .emit('message', { user: 'admin', text: `${user.name}, has joined!` })
      // callback()
    })
    socket.on('userAddTopicComment', ({ topicComment }, callback) => {
      const user = getUsers(socket.id)
      if (!user.name) return
      socket.broadcast.to(user.room).emit('addTopicComment', { topicComment })
    })
    socket.on('userAddPostComment', ({ postComment }, callback) => {
      const user = getUsers(socket.id)
      if (!user.name) return
      socket.broadcast.to(user.room).emit('addPostComment', { postComment })
    })
    socket.on('updateUser', ({ avatar, name }, calback) => {
      console.log('updateUser', avatar, name)
      updateUser(socket.id, name, avatar)
    })
    socket.on('disconnect', () => {
      removeUser(socket.id)
      console.log('User have left')
    })
  })
}
