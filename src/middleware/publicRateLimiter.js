import rateLimit from "next-rate-limit";

export const publicLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500, // Max IPs to track
  limit: 100, // Each IP allowed 100 hits per 15 minutes
});
