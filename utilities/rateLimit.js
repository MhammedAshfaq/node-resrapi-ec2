import rateLimit from "express-rate-limit";

export const limitter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later or condact administrator",
  },
});
