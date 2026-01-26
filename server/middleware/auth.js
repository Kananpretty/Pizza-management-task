const jwt = require("jsonwebtoken");
const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info (id and role) to the request object
      req.user = decoded;

      return next(); // Move to the next middleware or route
    } catch (error) {
      // 1. Log the error for the developer (you), but don't let it crash the app
      console.error("JWT Verification Error:", error.name);

      // 2. Give specific feedback to the frontend
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expired", code: "TOKEN_EXPIRED" });
      }

      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to check user Roles (Authorization)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role ${req.user.role} is not authorized to access this route`,
      });
    }

    next();
  };
};
module.exports = { protect, authorize };
