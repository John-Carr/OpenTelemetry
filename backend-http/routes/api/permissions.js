const express = require("express");
const router = express.Router();

/* Middleware */
const auth = require("../../middleware/auth");
const permissions = require("../../middleware/permissions");

router
  .route("/")
  .all(auth)
  .get((req, res) => {
    permissionArray = [];
    for (var permission in permissions)
      permissionArray.push({ name: permissions[permission] });
    res.json({ permissionArray });
  });

module.exports = router;
