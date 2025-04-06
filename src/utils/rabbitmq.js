import amqplib from "amqplib";

let channel;

const connectRabbitMQ = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  channel = await connection.createChannel();
};

export const publishToQueue = async (queueName, message) => {
  if (!channel) await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
};

export const consumeFromQueue = async (queueName, callback) => {
  if (!channel) await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      await callback(content);
      channel.ack(msg);
    }
  });
};
