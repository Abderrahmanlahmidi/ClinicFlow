const express = require("express");
const router = express.Router();
const User = require("../models/User");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.get("/users", isAuthenticated(["Admin"]) ,async (req, res) => {

  try{
    const users = await User.find().populate("roleId");

    if(!users){
      return res.status(400).json({
        message:"No any User Found"
      })
    }

    return res.status(200).json({
      users:users
    })
  
  }catch(error){
    return res.status(500).json({
      error:error.message
    })
  }

})

router.patch("/update-profile/:id", async (req, res) => {

    const id = req.params.id;
    const {} = req.body

    const userInfo = await User.findById(id);

    if(!userInfo){
        return res.status(400).json({
            message:"No any user information found"
        })
    }



 
    
    
})








module.exports = router;