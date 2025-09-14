export const asycHandle = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const asyncHandle = (functionHandler = async (req, res, next) => {
//   return await Promise.resolve(functionHandler(req, res, next)).catch((err) =>
//     next(err)
//   );
// });
