const config = require("config");
const axios = require("axios");
function robot(req, res, next) {
  if (!req.body.token) {
    return res.status(401).json({ msg: "No token.", success: false });
  }

  const captcha = config.get("captcha");

  axios
    .post(captcha.url + `?secret=${captcha.secret}&response=${req.body.token}`)
    .then((cap_res) => {
      console.log(cap_res);
      const { success } = cap_res.data;
      if (success) {
        next();
      } else {
        res.status(400).json({ msg: "You are a robot.", success: false });
        console.log(cap_res.data);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "reCAPTCHA error", success: false });
    });
}

module.exports = robot;
