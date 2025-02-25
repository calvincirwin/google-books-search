const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET_KEY || "default-secret";
const expiration = "2h";

module.exports = {
  authMiddleware: ({ req }) => {
    console.log("\n🔹 Incoming Request:", req.method, req.originalUrl);
    console.log("🔹 Headers:", req.headers);

    let token = req.headers.authorization || "";

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    if (!token) {
      console.log("❌ No token provided for this request.");
      return { user: null };
    }

    try {
      const { data } = jwt.verify(token, secret);
      console.log("✅ Authenticated User:", data);
      return { user: data };
    } catch (err) {
      console.log("❌ Invalid Token:", err.message);
      return { user: null };
    }
  },

  signToken: (user) => {
    return jwt.sign({ data: user }, secret, { expiresIn: expiration });
  },
};
