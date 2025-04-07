// test/notification.test.js
import { jest } from '@jest/globals';

// 👇 Mock nodemailer BEFORE importing emailService
const sendMailMock = jest.fn();

jest.unstable_mockModule('nodemailer', () => ({
  default: {
    createTransport: () => ({
      sendMail: sendMailMock,
    }),
  },
}));

// ⏳ Re-import modules after mocking
const { sendEmail } = await import('../src/services/emailService.js');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterAll(() => {
    console.error.mockRestore();
  });
  

describe('Notification Service', () => {
  beforeEach(() => {
    sendMailMock.mockReset();
  });

  it('should send booking confirmation email', async () => {
    sendMailMock.mockResolvedValue('Email sent');

    const result = await sendEmail(
      'test@example.com',
      'Booking Confirmed',
      '<h1>Test Booking</h1>'
    );

    expect(sendMailMock).toHaveBeenCalled();
    expect(result).toBe('Email sent');
  });

  it('should handle email sending errors', async () => {
    sendMailMock.mockRejectedValue(new Error('SMTP failed'));

    await expect(
      sendEmail('test@example.com', 'Booking', '<p>Test</p>')
    ).rejects.toThrow('SMTP failed');
  });
});
