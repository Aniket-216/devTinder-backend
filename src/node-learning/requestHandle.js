const express = require("express");

const app = express();

// this part is a request handle
app.use("/hello", (req, res) => {
    res.send("hello hello hello!");
});
app.use("/test", (req, res) => {
    res.send("Hello from the test server");
});
app.use("/", (req, res) => {
    res.send("Hello from the Dashboard server");
});

app.listen(7777, () => {
    console.log("Server is successfully listening to port 7777...");
});
