import redisClient from "../dbConfig/redis.js";

export function generateMobileOtp() {
  // return Math.floor(100000 + Math.random() * 900000).toString();
  return '123456';
}

export async function storeOtp(identifier, otp, channel = 'mobile', type = 'login') {
  if (!identifier) throw new Error("Identifier is required for storing OTP");

  const key = `${type}:${channel}:${identifier}`;
  const value = JSON.stringify({
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, 
  });

  try {
    await redisClient.setEx(key, 300, value); // 5 minutes = 300 seconds
    console.log('OTP stored with key:', key);
  } catch (err) {
    console.error('Failed to store OTP in Redis:', err);
  }
}

// Verify OTP
export async function verifyOtp(identifier, inputOtp, channel = 'mobile', type = 'login') {
  if (!identifier) throw new Error("Identifier is required for verifying OTP");

  const key = `${type}:${channel}:${identifier}`;

  try {
    const recordStr = await redisClient.get(key);
    if (!recordStr) return false;

    let record;
    try {
      record = JSON.parse(recordStr);
    } catch (parseErr) {
      console.error('Invalid JSON in Redis OTP record:', parseErr);
      return false;
    }

    const isValid = record.otp === inputOtp && Date.now() <= record.expiresAt;
    if (isValid) {
      await redisClient.del(key); // Invalidate OTP after success
    }

    return isValid;
  } catch (error) {
    console.error('OTP verification error:', error);
    return false;
  }
}
