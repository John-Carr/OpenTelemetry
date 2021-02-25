const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const auth = require("../../middleware/auth");
const crypto = require("crypto");

/* Models */
const User = require("../../models/User");
const PendingUser = require("../../models/PendingUser");
const Role = require("../../models/Roles");
// Email service used for sending registration emails to users
sgMail.setApiKey(config.get("email").apiKey);

// -- Dev Code -- \\
// @route  POST api/users
// @brief  Register new user
// @access Public
// @desc   This is for development it is a "backdoor" to register without an invitation
if (process.env.NODE_ENV === "development") {
  router.post("/dev/register", (req, res) => {
    const { nameF, nameL, email, password } = req.body;
    // Validation
    if (!nameF || !nameL || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    User.findOne({ email }).then((user) => {
      if (user) return res.status(400).json({ msg: "User already exits" });

      const newUser = new User({
        nameF,
        nameL,
        email,
        password,
      });

      // Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then((user) => {
            jwt.sign(
              { id: user.id },
              config.get("jwtSecret"),
              { expiresIn: 3600 },
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
    });
  });
}
// -- End Dev Code -- \\
// @route  POST api/users/pending
// @brief  Invite a new user to the service
// @access Private
// @desc   This requires the user admin privledge (TODO) and will send an email to the given email
//         to invite the user to finish setting up their account
router
  .route("/invite")
  .all(auth)
  .post((req, res) => {
    const { nameF, nameL, email, phone, role } = req.body;
    console.log(req.body);
    if (!nameF || !nameL || !email || !phone) {
      res.status(400).json({ msg: "Please fill out all required fields" });
    }
    // check to see if the user already exists in the DB
    User.findOne({ email }).then((user) => {
      if (user) return res.status(400).json({ msg: "User already exits" });
      else {
        // check to see if user is already pending
        PendingUser.findOne({ email }).then((user) => {
          if (user)
            return res
              .status(400)
              .json({ msg: "User has already been invited" });
          else {
            // has the token in the db so it is safe from anyone with DB access
            var token = crypto.randomBytes(20).toString("hex");
            Role.findOne({ name: role })
              .select("_id")
              .then((role) => {
                if (!role) {
                  return res.status(400).json({ success: false });
                }
                console.log(role);
                // create new pending user
                const newPendingUser = new PendingUser({
                  nameF: nameF,
                  nameL: nameL,
                  email: email,
                  phone: phone,
                  role: role._id,
                  issuedBy: req.user.id,
                });

                // Create salt & hash
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(token, salt, (err, hash) => {
                    if (err) throw err;
                    newPendingUser.authToken = hash;
                    newPendingUser.save().then((user) => {
                      // send email
                      let urltoken = `${newPendingUser._id}?${token}`;
                      var mailOptions = {
                        from: config.get("email").user,
                        to: email,
                        subject: "Register For SolarGators Website",
                        text: urltoken,
                        html:
                          '<p>Click <a href="http://localhost:3000/register/' +
                          urltoken +
                          '">here</a> to register your account.</p>',
                      };
                      sgMail.send(mailOptions, function (error, info) {
                        if (error) {
                          console.log(error);
                        } else {
                          console.log("Email sent: " + info.response);
                        }
                      });
                      res.json({ user });
                    });
                  });
                });
              });
          }
        });
      }
    });
  });
// @route  POST api/users/complete-reg
// @brief  Routes for completeing user account registration
// @access Reg token protected
// @desc   This requires the user to present a valid registration token.
//         That is the user must have the correct id and token
router
  .route("/complete-reg/:id")
  // Validate the information that was provided
  .all((req, res, next) => {
    const token = req.query.token;
    const userId = req.params.id;
    if (!token || !userId) {
      return res.status(400);
    }
    PendingUser.findById(userId).then((user) => {
      if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
      }
      // if we found a user verify the token
      bcrypt.compare(token, user.authToken).then((isMatch) => {
        if (!isMatch)
          return res.status(400).json({
            msg: "User does not exist",
          });
        // if the token is valid add the user to the request
        req.user = user;
        next();
      });
    });
  })
  // @brief Returns the user data to the client
  .get((req, res) => {
    // if we are validated we want to return the user info to the client
    res.json({
      nameF: req.user.nameF,
      nameL: req.user.nameL,
      email: req.user.email,
      phone: req.user.phone,
    });
  })
  // @brief Completes the user registration
  // @desc  Removes pending user and creates new user in the user database
  .post((req, res) => {
    // make sure the user's email is not in the database
    User.findOne({ email: req.user.email }).then((user) => {
      // if there was a user return a bad request
      if (user) return res.status(400).json({ msg: "User already exits" });
      // if there was no user procede with making a new user
      const newUser = new User({
        nameF: req.body.nameF,
        nameL: req.body.nameL,
        email: req.user.email, // important to not allow the email to be changed by the user registering
        phone: req.body.phone,
        password: req.body.pass,
        role: req.user.role, // important to not allow the role to be changed by the user registering
      });
      // hash password and save user
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then((user) => {
            // remove user from list of pending users
            PendingUser.findByIdAndDelete(req.params.id)
              .then(() => {
                jwt.sign(
                  { id: user.id },
                  config.get("jwtSecret"),
                  { expiresIn: 3600 },
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
              })
              .catch(() => {
                // handle not being able to delete pending user
                console.log("Pending user could not be removed.");
              });
          });
        });
      });
    });
  });
// @route  POST api/users/active
// @brief  Routes for interacting with the active user database
// @access Private
// @desc   This route can be used to delete update and get user data
router
  .route("/active/:id?")
  .all(auth)
  .get((req, res) => {
    if (req.params.id) {
      User.findById(req.params.id)
        .select("-password")
        .then((user) => {
          if (!user) {
            res.status(400).json({ msg: "User not found" });
          }
          res.json(user);
        })
        .catch((err) => res.status(400).json({ success: false }));
    } else {
      User.find()
        .select("-password")
        .populate("role", "name")
        .then((users) => {
          res.json(users);
        })
        .catch((err) => res.status(400).json({ success: false }));
    }
  })
  .delete((req, res) => {
    if (!req.params.id) {
      return res.status(400);
    }
    User.findByIdAndDelete(req.params.id)
      .then(() => {
        res.json({ success: true });
      })
      .catch((err) => res.status(400).json({ success: false }));
  });
// @route  POST api/users/pending
// @brief  Routes for interacting with the pending user database
// @access Private
// @desc   This route can be used to delete update and get pending user data
router
  .route("/pending/:id?")
  .all(auth)
  .get((req, res) => {
    if (req.params.id) {
      PendingUser.findById(req.params.id)
        .select("-authToken")
        .then((user) => {
          if (!user) {
            res.status(400).json({ msg: "User not found" });
          }
          res.json(user);
        })
        .catch((err) => res.status(400).json({ success: false }));
    } else {
      PendingUser.find()
        .select("-authToken")
        .sort({ createdAt: -1 })
        .then((users) => {
          if (!users) {
            res.status(400).json({ msg: "User not found" });
          }
          res.json(users);
        })
        .catch((err) => res.status(400).json({ success: false }));
    }
  })
  .delete((req, res) => {
    if (!req.params.id) {
      return res.status(400);
    }
    PendingUser.findByIdAndDelete(req.params.id)
      .then(() => {
        res.json({ success: true });
      })
      .catch((err) => res.status(400).json({ success: false }));
  });
module.exports = router;
