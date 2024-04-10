export default (req, res, next) => {
  res.status(404).json({ message: "resource was not found on this server" });
};
