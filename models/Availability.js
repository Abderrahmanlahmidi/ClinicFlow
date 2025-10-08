const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  dayOfWeek: { 
    type: String, 
    required: true 
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  }
});

const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = Availability;
