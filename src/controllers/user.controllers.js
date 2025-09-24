import {  asyncHandle } from "../utils/asycHandle.js";

export const registerUser = asyncHandle(async (req, res) => {
  res.status(200).json({
    message:"ok"
  })
});
