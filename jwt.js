const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  try {
    // Check if Authorization header is present and formatted correctly
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - Token Not Found" });
    }

    // Extract JWT token
    const token = authorization.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to request object
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);

    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Function to generate JWT token
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { jwtAuthMiddleware, generateToken };
