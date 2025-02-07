import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { failureResponse } from "../utilities/errorHandling.js";
import { Messages } from "../utilities/message.js";

export const protect = async (req, res, next) => {
  let token;
  //Checking token
  if (
    req.headers.authorization ||
    req.headers.authorization.startsWith("Bearer") ||
    req.cookies.token
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return failureResponse(res, Messages.USER_NOT_AUTHORIZED);
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);
    if (!user) {
      return failureResponse(res, Messages.USER_NOT_FOUND);
    }
    req.user = user;
    next();
  } catch (error) {
    return failureResponse(res, Messages.INTERNAL_SERVER_ERROR);
  }
};
