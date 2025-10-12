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


const routes = [
    { path: "/api/auth", route: require("./routes/auth/register") },
    { path: "/api/auth", route: require("./routes/auth/login") },
    { path: "/api/clinic", route: require("./routes/clinic/role") },
    {path:"/api/clinic", route: require("./routes/clinic/speciality") },
];

routes.forEach(r => app.use(r.path, r.route));


app.listen(3000, () => {
  console.log(`Server Started at http://localhost:3000`);
  console.log("Swagger Docs: http://localhost:3000/api-docs");
});
