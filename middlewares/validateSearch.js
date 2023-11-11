module.exports = (req, res, next) => {
  const { q } = req.query;
  if (q === undefined) return res.status(200).json([]);
  next();
};