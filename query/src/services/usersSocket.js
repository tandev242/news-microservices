const users = []
const addUser = ({ id, avatar, room, name }) => {
  const user = { id, avatar, room, name }
  users.push(user)
  return user
}
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)
  if (index > -1) return users.splice(index, 1)
}
const getUsers = (id) => {
  const user = users.find((user) => user.id === id)
  return user
}
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room)
}
const updateUser = (id, name, avatar) => {
  const user = users.find((user) => user.id === id)
  user.name = name
  user.avatar = avatar
  return true
}

module.exports = { addUser, removeUser, getUsers, getUsersInRoom, updateUser }
