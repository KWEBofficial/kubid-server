export const handleAuthRequest = async (req, res, next) => {
  try {
    res.json({ result: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { handleAuthRequest };
