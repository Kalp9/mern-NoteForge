const rateLimitMiddleware = async (req, res, next) => {
    try {
        const ip = req.ip || "anonymous";

        const { success } = await ratelimiter.limit(ip); // ✅ correct

        if (!success) {
            return res.status(429).json({
                message: "Too many requests, please try again later."
            });
        }

        next(); // ✅ required
    } catch (error) {
        console.error("Rate limiter error:", error); // 🔥 log it
        next(); // ✅ don't block request
    }
};

export default rateLimitMiddleware;