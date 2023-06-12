const status = require("http-status");
const has = require("has-keys");
const admins = require("../admins.js");
require("mandatoryenv").load(["ADMIN_PASSWORD", "ADMIN_TOKEN"]);

module.exports = {
  async accessAdmin(req, res) {
    // #swagger.tags = ['Auth']
    // #swagger.summary = 'Access to admin'
    const password = req.data.password;
    if (password === process.env.ADMIN_PASSWORD) {
      const token = process.env.ADMIN_TOKEN;
      res.status(status.OK).json({message: "Access granted", data: token });
    } else {
      throw new Error("Wrong password");
    }
  },
};
