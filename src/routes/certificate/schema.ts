import Joi from "joi";
export const schema = Joi.object().keys({
  content: Joi.string().allow(""),
  user: Joi.number().integer().strict(),
});
