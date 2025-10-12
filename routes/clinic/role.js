const express = require('express');
const Role = require("../../models/Role");
const router = express.Router();
const isAuthenticated = require("../../middlewares/isAuthenticated");


router.get("/get-roles", async (req, res) => {
    try {
        const roles = await Role.find()
        if (!roles) {
            return res.status(404).json({message: "No roles found"});
        }

        return res.status(200).json({
            message: "Roles found", roles: roles
        });
    } catch (err) {
        console.log("error get roles", err);
        return res.status(500).json({message: "Internal server error."});
    }
})

router.post("/create-role", async (req, res) => {

    const {name, description} = req.body;

    if (!name || !description) {
        return res.status(400).json({message: "Name and description are required."});
    }

    try {
        const existingRole = await Role.findOne({name: name.trim()});

        if (existingRole) {
            return res.status(400).json({message: "Role already exists"});
        }

        const newRole = await Role.create({
            name: name.trim(), description: description.trim(),
        });

        return res.status(201).json({
            message: "Role successfully created", role: newRole,
        });
    } catch (err) {
        console.error("Error creating role:", err);
        return res.status(500).json({message: "Internal server error."});
    }
});

router.patch("/update-role/:id", async (req, res) => {

    const {name, description} = req.body;

    if (!name || !description) {
        return res.status(400).json({message: "Name and description are required."});
    }

    try {
        const roleId = req.params.id;

        const role = await Role.findById(roleId);

        if (!role) {
            return res.status(404).json({message: "No role found."});
        }

        if (name) role.name = name.trim();
        if (description) role.description = description.trim();

        await role.save();

        return res.status(201).json({message: "Role successfully updated"});

    } catch (err) {
        console.error("Error updating role:", err);
        return res.status(500).json({message: "Internal server error."});
    }

})

router.delete("/delete-role/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Role.deleteOne({_id: id});

        if (result.deletedCount === 0) {
            return res.status(404).json({message: "Role not found"});
        }

        return res.status(200).json({message: "Role successfully deleted"});
    } catch (err) {
        console.error("Error deleting role:", err);
        return res.status(500).json({message: "Internal server error."});
    }
});

module.exports = router;