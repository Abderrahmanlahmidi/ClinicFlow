const mongoose = require("mongoose");


const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }
}, {collection:"Role"});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;