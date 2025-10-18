const express = require('express');
const Role = require("../models/Role");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");


router.get("/get-roles", async (req, res) => {
    try {
        const roles = await Role.find()
        if (!roles || roles.length === 0) {
            return res.status(404).json({message: "No roles found"});
        }

        return res.status(200).json({
            message: "Roles retrieved successfully",
            roles: roles
        });
    } catch (error) {
        return res.status(500).json({error:error.message});
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
            return res.status(409).json({message: "Role already exists"});
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
        return res.status(500).json({error:error.message});
    }
});

router.patch("/update-role/:id", async (req, res) => {

    const {name, description} = req.body;

    if (!name && !description) {
        return res.status(400).json({message: "At least one field (name or description) is required to update."});
    }

    try {
        const roleId = req.params.id;

        const role = await Role.findById(roleId);

        if (!role) {
            return res.status(404).json({message: "Role not found."});
        }


        if (name && name.trim() !== role.name) {
            const existingRole = await Role.findOne({name: name.trim()});
            if (existingRole) {
                return res.status(409).json({message: "Role name already exists"});
            }
        }

        if (name) role.name = name.trim();
        if (description) role.description = description.trim();

        await role.save();

        return res.status(200).json({
            message: "Role updated successfully",
            role: role
        });

    } catch (error) {
        return res.status(500).json({error:error.message});
    }

})

router.delete("/delete-role/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const result = await Role.deleteOne({_id: id});

        if (result.deletedCount === 0) {
            return res.status(404).json({message: "Role not found"});
        }

        return res.status(200).json({message: "Role deleted successfully"});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
});

module.exports = router;