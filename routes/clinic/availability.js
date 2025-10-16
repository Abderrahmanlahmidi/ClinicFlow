const express = require('express');
const Availability = require("../../models/Availability");
const router = express.Router();


router.get('/availabilities/:userId', async (req, res) => {

    const {userId} = req.params;

    try {
        const userAvailabilities = await Availability.find({userId})

        if (!userAvailabilities || userAvailabilities.length === 0) {
            return res.status(404).json({message: "No availabilities found for this user"});
        }

        return res.status(200).json({
            success: true,
            userAvailabilities: userAvailabilities
        });

    } catch (error) {
        return res.status(400).json({error:error})
    }

})

router.get("/availabilities", async (req, res) => {
    try {

        const availabilities = await Availability.find();

        if (!availabilities) {
            return res.status(404).json({message: "No availabilities found"});
        } else {
            return res.status(200).json({
                success: true,
                availabilities: availabilities
            });
        }

    } catch (error) {
        return res.status(400).json({error:error})
    }
})


router.post("/create-availability", async (req, res) => {
    const {dayOfWeek, startTime, endTime, userId, dailyCapacity} = req.body;


    if (!dayOfWeek || !startTime || !endTime || !userId || !dailyCapacity) {
        return res.status(400).json({message: "dayOfWeek or startTime or endTime or dailyCapacity or userId are required."})
    }

    const startHour = Number(startTime.split(':')[0]);
    const endHour = Number(endTime.split(':')[0]);

    if (startHour >= endHour) {
        return res.status(400).json({message: "Start time must be earlier than end time."})
    }

    try {
        const existingDay = await Availability.findOne({userId});

        if(existingDay) {
            if (dayOfWeek === existingDay.dayOfWeek) {
                return res.status(400).json({message: "Availability already exists"});
            }
        }


        await Availability.create({
            dayOfWeek: dayOfWeek,
            startTime: startTime,
            endTime: endTime,
            dailyCapacity: dailyCapacity,
            userId: userId
        })

        return res.status(200).json({message: "Availability created successfully."})

    } catch (error) {

        return res.status(400).json({error: error.message})
    }

})
 

router.put("/update-availability/:id", async (req, res) => {

    const {id} = req.params;
    const {dayOfWeek, startTime, endTime, dailyCapacity, userId} = req.body;

    try {

        const availability = await Availability.findById(id);

        if (dayOfWeek) availability.dayOfWeek = dayOfWeek;
        if (startTime) availability.startTime = startTime;
        if (endTime) availability.endTime = endTime;
        if (dailyCapacity) availability.dailyCapacity = dailyCapacity;
        if (userId) availability.userId = userId;
        await availability.save();

        return res.status(200).json({message: "Availability updated successfully."})

    } catch (error) {
        return res.status(400).json({error:error})
    }

})

router.delete("/delete-availability/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const result = await Availability.deleteOne({_id:id});

        if (result.deletedCount === 0) {
            return res.status(404).json({message: "Availability not found"});
        }

        return res.status(200).json({message: "Availability successfully deleted"});

    } catch (error) {
        return res.status(400).json({error:error});
    }

})

module.exports = router;