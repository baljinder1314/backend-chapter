import { asycHandle } from "../utils/asycHandle.js";

export const registerUser = asycHandle(async (req, res) => {
  res.status(200).json({
    message: "ok",
    from:"how have you been dear!"
  });
});
