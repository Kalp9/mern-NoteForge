const buckets = new Map();

const getClientKey = (req, scope) => {
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  return `${scope}:${ip}`;
};

const createMemoryRateLimiter = ({ windowMs, max, scope, message }) => {
  return (req, res, next) => {
    const now = Date.now();
    const key = getClientKey(req, scope);
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      return res.status(429).json({ message });
    }

    current.count += 1;
    buckets.set(key, current);
    next();
  };
};

export const forgotPasswordLimiter = createMemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  scope: "forgot-password",
  message: "Too many password reset requests. Please try again later.",
});

export const verifyOtpLimiter = createMemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  scope: "verify-otp",
  message: "Too many OTP attempts. Please try again later.",
});
