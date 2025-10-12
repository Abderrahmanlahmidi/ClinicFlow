require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auth API",
            version: "1.0.0",
            description: "Documentation for Login & Register routes",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./routes/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});


const Register = require("./routes/auth/register");
const Login = require("./routes/auth/login");

app.use("/api/auth", Register);
app.use("/api/auth", Login);

app.listen(3000, () => {
  console.log(`Server Started at http://localhost:3000`);
  console.log("Swagger Docs: http://localhost:3000/api-docs");
});
