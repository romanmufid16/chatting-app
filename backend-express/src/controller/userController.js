import userService from "../services/userService.js"

const registerUser = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(201).json({
      message: "Register Successful",
      data: result
    });
  } catch (error) {
    next(error);
  }
}

const loginUser = async (req, res, next) => {
  try {
    const token = await userService.login(req.body);
    res.status(200).json({
      message: "Login Successful",
      data: token
    });
  } catch (error) {
    next(error);
  }
}

export default {
  registerUser,
  loginUser
}