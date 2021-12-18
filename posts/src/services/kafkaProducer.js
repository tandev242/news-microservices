const kafka = require("kafka-node");
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: "127.0.0.1:9092" });
const producer = new Producer(client);

const sendProducer = async (topic, message) => {
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


module.exports = {sendProducer}