const socket = require("socket.io")

module.exports = (server) => {
    const io = socket(server, {
        cors: {
            origin: "*",
        }
    })

    io.on("connection", (socket) => {
        console.log("Realtime Comment connected ")

        socket.on("sendPostComment", (data) => {
            socket.emit("getPostComment", data);
        })

        socket.on("test", (data) => {
            socket.emit("return test", data);
        })

        socket.on("sendTopicComment", async (postId) => {
            setInterval(async () => {
                const data = await commentController.getTopicCommentByPostId(postId);
                socket.emit("getTopicComments", data);
            }, 300)
        })

        socket.on("disconnect", () => {
            console.log("Realtime Comment disconnected ");
        })
    })
}