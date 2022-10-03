import Joi from "joi";
export const schema = Joi.object().keys({
  username: Joi.string().allow(""),
  password: Joi.string().allow(""),
});
