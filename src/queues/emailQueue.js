// src/queues/emailQueue.js
import amqplib from "amqplib";

let channel;

const QUEUE_NAME = "emailQueue";

const connectRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log("✅ Connected to RabbitMQ & Queue asserted");
  } catch (error) {
    console.error("❌ RabbitMQ connection error:", error);
  }
};

const sendToQueue = async (data) => {
  if (!channel) {
    await connectRabbitMQ();
  }
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)), {
    persistent: true,
  });
};

export { connectRabbitMQ, sendToQueue, QUEUE_NAME };
