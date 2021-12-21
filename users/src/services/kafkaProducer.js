const kafka = require('kafka-node')
const Producer = kafka.Producer
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_URL })
const producer = new Producer(client)
client.on('ready', () => {
  console.log('POST has connected to kafka')
})

const sendProducer = async (topic, message) => {
  producer.send(
    [{ topic: topic, messages: JSON.stringify(message) }],
    function (err, data) {
      if (err) {
        console.log(err)
      }
      console.log(data)
    }
  )
}

module.exports = { sendProducer }
