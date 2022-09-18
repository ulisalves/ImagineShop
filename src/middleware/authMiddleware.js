export const authMiddleware = (req, res, next) => {
  const id = req.params.id;
  if (id === "6316a584529e2028c83f00d4") {
    return next();
  }
  return res.status(401).json({ message: "Não autorizado" });
};
