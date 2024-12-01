import Joi from "joi";

export const userValidation = Joi.object({
  username: Joi.string().max(100).required().messages({
    'string.base': 'Username must be a string.',
    'string.empty': 'Username cannot be empty.',
    'any.required': 'Username is required.',
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.base': 'Password must be a string.',
    'string.empty': 'Password cannot be empty.',
    'string.min': 'Password must be at least 6 characters long.',
    'any.required': 'Password is required.',
  })
});