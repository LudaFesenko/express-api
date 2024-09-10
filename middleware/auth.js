const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Полчуить токен из заголовка Authorization
  const authHead = req.headers["authorization"];
  const token = authHead && authHead.split(" ")[1];

  // Проверям, есть ли токен
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
  }

  // Проверяем токен
  jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
    if (error) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user;

    next();
  });
};

module.exports = authenticateToken;
