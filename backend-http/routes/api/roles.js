const express = require("express");
const router = express.Router();
/* Models */
const Role = require("../../models/Roles");
/* Middleware */
const auth = require("../../middleware/auth");

router
  .route("/:id?")
  .all(auth)
  .get((req, res) => {
    Role.find().then((roles) => {
      res.json(roles);
    });
  })
  .post((req, res) => {
    const { name, desc, permissions } = req.body;
    if ((!name, !desc, !permissions)) {
      res.status(400);
      return;
    }
    const newRole = new Role({
      name: name,
      description: desc,
      permissions: permissions,
      created_by: req.user.id,
    });
    newRole
      .save()
      .then((item) => res.json(item))
      .catch((err) => res.status(400).json({ success: false }));
  })
  .delete((req, res) => {
    Role.findByIdAndDelete(req.params.id)
      .then((role) => {
        res.json({ success: true });
      })
      .catch(
        res.status(400).json({ success: false, msg: "Failed to delete role." })
      );
  });
module.exports = router;
