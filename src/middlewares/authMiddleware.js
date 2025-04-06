import jwt from "jsonwebtoken";

// Middleware to authenticate user
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure required fields are present
    const { id, role, email } = decoded;
    if (!id || !email) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { id, role, email }; // Attach essential info
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to authorize only Admins
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Admins only." });
  }
  next();
};

export { authMiddleware, adminMiddleware };
