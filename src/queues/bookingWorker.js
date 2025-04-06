import amqp from "amqplib";
import nodemailer from "nodemailer";

const startWorker = async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("booking_confirmations");

  console.log("📥 Waiting for booking confirmations...");

  channel.consume("booking_confirmations", async (msg) => {
    const bookingData = JSON.parse(msg.content.toString());
    console.log("📨 Received booking:", bookingData);

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "your-email@gmail.com",
        pass: "your-app-password",
      },
    });

    const mailOptions = {
      from: "Flight Booking <your-email@gmail.com>",
      to: bookingData.email,
      subject: "Your Flight Booking is Confirmed",
      text: `Booking confirmed!\nFlight ID: ${bookingData.flightId}\nSeats: ${bookingData.seats}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent to", bookingData.email);
      channel.ack(msg);
    } catch (error) {
      console.error("❌ Failed to send email:", error.message);
    }
  });
};

startWorker();
