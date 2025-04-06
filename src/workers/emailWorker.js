import amqplib from "amqplib";
import nodemailer from "nodemailer";
import { QUEUE_NAME } from "../queues/emailQueue.js";

const startWorker = async () => {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  channel.consume(QUEUE_NAME, async (msg) => {
    if (msg !== null) {
      const emailData = JSON.parse(msg.content.toString());
      console.log("📬 Sending email to:", emailData.to);

      // Nodemailer setup
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: emailData.to,
          subject: emailData.subject,
          text: emailData.text,
        });

        console.log("✅ Email sent!");
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Email error:", err.message);
        channel.nack(msg); // Retry or move to dead-letter queue
      }
    }
  });

  console.log("📩 Email Worker is listening...");
};

startWorker();
