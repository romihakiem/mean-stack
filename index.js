const express = require("express");
const cors = require("cors");

const app = express();
app.use(
    cors({
        origin: "http://localhost:8081",
    })
);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// base path
app.get("/", (req, res) => {
    res.json({ message: "Hello World!" });
});

require("./app/routes/auth")(app);
require("./app/routes/user")(app);

// sync database
const conn = require("./app/models/connection");
const Role = conn.role;
conn.sequelize
    .sync()
    .then(() => {
        console.log("Synced db.");
        // initial();
    })
    .catch((err) => {
        console.log(`Failed to sync db: ${err}`);
        process.exit();
    });

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    Role.create({
        id: 1,
        name: "user",
    });
    Role.create({
        id: 2,
        name: "moderator",
    });
    Role.create({
        id: 3,
        name: "admin",
    });
}
