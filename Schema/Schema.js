db.createCollection("Role", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "description"],
      properties: {
        name: { bsonType: "string"},
        description: { bsonType: "string" }
      }
    }
  }
});

db.createCollection("User", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["firstName", "lastName", "email", "password", "numberPhone", "roleId", "status"],
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        email: { bsonType: "string" },
        imageProfile: { bsonType: "string" },
        password: { bsonType: "string" },
         numberPhone: {
          bsonType: "int",
        },
        status:{
             bsonType: "string",
             enum: ['active', 'suspended'],
        },
        roleId: {
          bsonType: "objectId",
        }
      }
    }
  }
});


db.createCollection("Appointment", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["date", "status", "patientId"],
      properties: {
        date: {
          bsonType: "date",
        },
        status: {
          bsonType: "string",
          enum: ["pending", "confirmed", "cancelled"],
        },
        patientId: {
          bsonType: "objectId",
        }
      }
    }
  }
});
db.createCollection("Notification", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["type", "read", "message", "userId"],
      properties: {
        type: {
          bsonType: "string",
          enum: ["info", "warnning", "success"],
        },
          read:{
              bsonType:"bool"
          },
          message:{
            bsonType:"string"
          },
        userId: {
          bsonType: "objectId",
        },
      }
    }
  }
});

db.createCollection("Speciality", {
    validator:{
        $jsonSchema:{
            bsonType:"object",
            required:["name", "description"],
            properties:{
                name:{
                    bsonType:"string"
                },
                description:{
                    bsonType:"string"
                }
            }
        }
    }
})

db.createCollection("Availability", {
    validator:{
        $jsonSchema:{
            bsonType:"object",
            required:["userId", "startTime", "endTime", "dayOfWeek"],
            properties:{
                userId:{
                    bsonType:"objectId"
                },
                dayOfWeek:{
                    bsonType:"string"
                },
                startTime:{
                    bsonType:"date"
                },
                endTime:{
                    bsonType:"date"
                }
            }
        }
    }
})

db.createCollection("Consultation", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "consultationDate",
        "consultationReason",
        "diagnosis",
        "prescribedTreatment",
        "doctorNotes",
        "vitalId",
        "allergies",
        "bloodType",
        "weight",
        "bloodPressure",
        "temperature",
        "respiratoryRate",
        "hearRate",
        "height",
        "userId"
      ],
      properties: {
        consultationDate: {
          bsonType: "date",
          description: "Date of consultation"
        },
        consultationReason: {
          bsonType: "string",
          description: "Reason for consultation"
        },
        diagnosis: {
          bsonType: "string",
          description: "Diagnosis given by doctor"
        },
        prescribedTreatment: {
          bsonType: "string",
          description: "Treatment prescribed"
        },
        doctorNotes: {
          bsonType: "string",
          description: "Additional notes from doctor"
        },
        vitalId: {
          bsonType: "objectId",
          description: "Reference to VitalSigns document"
        },
        allergies: {
          bsonType: "string",
          description: "Patient allergies"
        },
        bloodType: {
          bsonType: "string",
          description: "Blood type"
        },
        weight: {
          bsonType: "double",
          description: "Patient weight"
        },
        bloodPressure: {
          bsonType: "string",
          description: "Blood pressure reading"
        },
        temperature: {
          bsonType: "double",
          description: "Body temperature"
        },
        respiratoryRate: {
          bsonType: "int",
          description: "Respiratory rate"
        },
        hearRate: {
          bsonType: "int",
          description: "Heart rate"
        },
        height: {
          bsonType: "double",
          description: "Patient height"
        },
        userId: {
          bsonType: "objectId",
          description: "Reference to User document"
        }
      }
    }
  }
});


db.createCollection("Prescription", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "consultationId",
        "medicineName",
        "dosage",
        "duration",
        "instructions"
      ],
      properties: {
        consultationId: {
          bsonType: "objectId",
          description: "Reference to Consultation document"
        },
        medicineName: {
          bsonType: "string",
          description: "Name of the prescribed medicine"
        },
        dosage: {
          bsonType: "string",
          description: "Dosage for the medicine"
        },
        duration: {
          bsonType: "string",
          description: "Duration of treatment"
        },
        instructions: {
          bsonType: "string",
          description: "Additional instructions for patient"
        }
      }
    }
  }
});

