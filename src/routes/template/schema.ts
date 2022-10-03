import Joi from "joi";
export const schema = Joi.object().keys({
  html: Joi.string().allow(""),
  photo: Joi.string().allow(""),
});
