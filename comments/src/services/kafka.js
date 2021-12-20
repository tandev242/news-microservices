const kafka = require("kafka-node");
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_URL });
const producer = new Producer(client);

const sendToConsumer = async (topic, message) => {
    producer.send(
        [{ topic: topic, messages: JSON.stringify(message) }],
        function (err, data) {
            if (err) {
                // throw new Error(err)
                console.log(err);
            }
            console.log(data);
        }
    );
};

module.exports = { sendToConsumer }