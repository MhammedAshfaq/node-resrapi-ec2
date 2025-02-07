import {
  failureResponse,
  failureResponseWithData,
  successResponse,
  successResponseWithData,
} from "../utilities/errorHandling.js";
import { Messages } from "../utilities/message.js";
import {
  userSigninValidator,
  userSignupValidator,
} from "../utilities/inputValidator/user.js";
import { User } from "../models/user.js";

export const userSignup = async (req, res) => {
  try {
    const { error } = userSignupValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return failureResponseWithData(
        res,
        Messages.VALIDATION_ERROR,
        error.details[0].message.replace(/"/g, "")
      );
    }
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser) {
      return failureResponse(res, Messages.USER_ALREADY_EXIST);
    }
    const { username, email, password } = req.body;
    const newUser = new User({
      username,
      email,
      password,
    });
    await newUser.save();
    return successResponse(res, Messages.USER_CREATED);
  } catch (error) {
    return failureResponse(res, error.message);
  }
};

export const userSignin = async (req, res) => {
  try {
    const { error } = userSigninValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return failureResponseWithData(
        res,
        Messages.VALIDATION_ERROR,
        error.details[0].message.replace(/"/g, "")
      );
    }
    const findUser = await User.findOne({ email: req.body.email });
    if (!findUser) {
      return failureResponse(res, Messages.USER_NOT_FOUND);
    }
    const comparePassword = await findUser.comparePassword(req.body.password);
    if (!comparePassword) {
      return failureResponse(res, Messages.PASSWORD_NOT_MATCH);
    }
    const token = findUser.getJwtToken(findUser);
    const { password, ...ref } = findUser._doc;
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    return successResponseWithData(res, Messages.USER_LOGGIN, {
      ...ref,
      token,
    });
  } catch (error) {
    return failureResponse(res, error.message);
  }
};
