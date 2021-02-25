const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/User");

// @route  POST api/auth
// @desc   Authenticate user
// @access Public
router.post("/", (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  User.findOne({ email }).then((user) => {
    if (!user)
      return res.status(400).json({ msg: "Incorrect username or password" });

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.status(400).json({ msg: "Incorrect username or password" });

      jwt.sign(
        { id: user.id },
        config.get("jwtSecret"),
        { expiresIn: 3600 }, // 1 hour session time
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              nameF: user.nameF,
              nameL: user.nameL,
              email: user.email,
            },
          });
        }
      );
    });
  });
});

// @route  GET api/auth/user
// @desc   Get user data
// @access Private
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user));
});

module.exports = router;
