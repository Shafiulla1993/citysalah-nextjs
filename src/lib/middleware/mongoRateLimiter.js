import RateLimit from "@/models/RateLimit";

export async function rateLimit(req, {
  keyPrefix = "public",      // identify the type of limiter
  limit = 100,               // max requests
  windowSec = 60,            // time window in seconds
} = {}) {
  
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const key = `${keyPrefix}_${ip}`;

  const now = new Date();
  const windowEnd = new Date(now.getTime() + windowSec * 1000);

  // Find current record
  let record = await RateLimit.findOne({ key });

  if (!record) {
    // First request
    await RateLimit.create({
      key,
      points: 1,
      expireAt: windowEnd,
    });
    return { success: true };
  }

  // Already exists
  if (record.points >= limit) {
    return { success: false, retryAfter: record.expireAt };
  }

  // Update existing record
  record.points += 1;
  await record.save();

  return { success: true };
}
