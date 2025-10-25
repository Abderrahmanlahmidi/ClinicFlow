import Role from "../models/Role.js";

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    if (!roles || roles.length === 0) {
      return res.status(404).json({ message: "No roles found" });
    }
    return res.status(200).json({
      message: "Roles retrieved successfully",
      roles,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createRole = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required." });
  }

  try {
    const existingRole = await Role.findOne({ name: name.trim() });
    if (existingRole) {
      return res.status(409).json({ message: "Role already exists" });
    }

    const newRole = await Role.create({
      name: name.trim(),
      description: description.trim(),
    });

    return res.status(201).json({
      message: "Role created successfully",
      role: newRole,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateRole = async (req, res) => {
  const { name, description } = req.body;
  const roleId = req.params.id;

  if (!name && !description) {
    return res
      .status(400)
      .json({
        message:
          "At least one field (name or description) is required to update.",
      });
  }

  try {
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found." });
    }

    if (name && name.trim() !== role.name) {
      const existingRole = await Role.findOne({ name: name.trim() });
      if (existingRole) {
        return res.status(409).json({ message: "Role name already exists" });
      }
    }

    if (name) role.name = name.trim();
    if (description) role.description = description.trim();

    await role.save();

    return res.status(200).json({
      message: "Role updated successfully",
      role,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteRole = async (req, res) => {
  const roleId = req.params.id;

  try {
    const result = await Role.deleteOne({ _id: roleId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Role not found" });
    }

    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
