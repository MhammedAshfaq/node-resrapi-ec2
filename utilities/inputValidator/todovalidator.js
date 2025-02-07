import Joi from "joi";

export const todoCreateValidator = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});
