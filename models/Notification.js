const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["info", "warnning", "success"], // enum types
    required: true 
  },
  read: { 
    type: Boolean, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
