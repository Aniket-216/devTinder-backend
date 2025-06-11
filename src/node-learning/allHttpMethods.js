const express = require("express");

const app = express();

// this part is a request handle

// this will only handle the GET call /user
app.get("/user", (req, res) => {
    res.send({ firstName: "Aniket", lastName: "Shinde" });
});

app.post("/user", (req, res) => {
    // Saving data to the db
    res.send("User created successfully");
});

app.delete("/user", (req, res) => {
    // Saving data to the db
    res.send("User deleted successfully");
});

// this will match all the HTTP methods API call to /test
app.use("/test", (req, res) => {
    res.send("Hello from the test server");
});

app.listen(7777, () => {
    console.log("Server is successfully listening to port 7777...");
});
