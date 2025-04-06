import { consumeFromQueue } from "../utils/rabbitmq.js";
import sendEmail from "../utils/email.js";

const startNotificationWorker = async () => {
  await consumeFromQueue("booking_emails", async (message) => {
    try {
      console.log("📨 Received email task:", message);

      await sendEmail({
        to: message.to,
        subject: message.subject,
        text: message.text,
      });

      console.log("✅ Email sent to:", message.to);
    } catch (err) {
      console.error("❌ Failed to send email:", err.message);
    }
  });
};

startNotificationWorker();
