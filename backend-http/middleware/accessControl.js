const permissions = require("permissions");
/* Models */
const User = require("../models/User");
const Role = require("../models/Roles");

function checkRole(requiredPermissions) {
  return function (req, res, next) {
    // search mongo for the user
    User.findById(req.user.id)
      .select("role")
      .populate("role", "permissions")
      .then((permissions) => {
        if (permissions.includes(requiredPermissions)) {
          next();
        } else {
          return res.status(401).json({
            msg: "You do not have the proper permissions for this action.",
          });
        }
      });
  };
}

module.exports = checkRole;
