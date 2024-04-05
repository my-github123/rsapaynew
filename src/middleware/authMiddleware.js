// // middleware/authMiddleware.js
// const jwt = require("jsonwebtoken");

// module.exports.verifyToken = (req, res, next) => {
//   const token = req.header("Authorization");

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized - Missing token" });
//   }

//   try {
//     const decoded = jwt.verify(
//       token.replace("Bearer ", ""),
//       process.env.JWT_SECRET
//     );
//     req.user = decoded.userId;
//     next();
//   } catch (error) {
//     console.error("Token verification error:", error);
//     res.status(401).json({ error: "Unauthorized - Invalid token" });
//   }
// };

const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = decoded; // Set the decoded user information on the req.user property
    next();
  });
};
