import { validate } from './../validation/validation.js';
import { userValidation } from './../validation/userValidation.js';
import { prismaClient } from './../app/database.js';
import bcrypt from "bcrypt";
import generateToken from '../utils/token.js';
import { ResponseError } from '../utils/errorResponse.js';

const register = async (request) => {
  const user = validate(userValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username
    }
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Username already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      id: true,
      username: true
    }
  });
}

const login = async (request) => {
  const loginRequest = validate(userValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username
    }
  });

  if (!user) {
    throw new ResponseError(400, "Invalid Credentials");
  }

  const isValid = await bcrypt.compare(loginRequest.password, user.password);

  if (!isValid) {
    throw new ResponseError(400, "Invalid Credentials");
  }

  return generateToken({ id: user.id, username: user.username });
}

export default {
  register,
  login
}