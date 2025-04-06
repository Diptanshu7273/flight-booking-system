import { getChannel } from "../config/rabbitmq.js";

export const consumeBookings = async () => {
  const channel = getChannel();

  if (!channel) {
    console.error("❌ Channel not initialized");
    return;
  }

  channel.consume("booking_queue", async (msg) => {
    const bookingData = JSON.parse(msg.content.toString());
    console.log("📩 Processing booking:", bookingData);

    // Simulate email sending
    console.log(`📧 Sending confirmation email to ${bookingData.email}...`);

    channel.ack(msg);
  });
};
