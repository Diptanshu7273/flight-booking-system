import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
    console.log("✅ Connected to RabbitMQ");

    await channel.assertQueue("booking_queue", { durable: true });
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ:", error.message);
  }
};

export const getChannel = () => channel;
