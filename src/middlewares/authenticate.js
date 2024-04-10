import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      createError(403, "Access denied");
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      createError("unauthorized", 401);
    }

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedPayload;
    next();
  } catch (err) {
    next(err);
  }
};
