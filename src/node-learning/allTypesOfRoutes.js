const express = require("express");

const app = express();

/**
 * older version of express before 4.x.x
 * /ac /abc both will work here
 */

// app.get("/ab?c", (req, res) => {
//     res.send({ firstName: "Aniket", lastName: "Shinde" });
// });
// abc /abbc /abbbbbbc will work
// app.get("/ab+c", (req, res) => {
//     res.send({ firstName: "Aniket", lastName: "Shinde" });
// });

/**
 * newer version of express after 5.x.x
 */

// now we have to use `/ab+c` to match the above route
// app.get(/ab+c/, (req, res) => {
//     res.send({ firstName: "Aniket", lastName: "Shinde" });
// });
// app.get(/ab?c/, (req, res) => {
//     res.send({ firstName: "Aniket", lastName: "Shinde" });
// });
// if you write `/ab*cd/` then whatever you write between `ab` and `cd` it will work
// for example `/abAniketcd` will work
// app.get(/ab*cd/, (req, res) => {
//     res.send({ firstName: "Aniket", lastName: "Shinde" });
// });
// app.get(/a(bc)?d/, (req, res) => {
//     res.send({ firstName: "Aniket", lastName: "Shinde" });
// });

// this means if there is a or a in any router of the string it will print
// app.get(/a/, (req, res) => {
//     res.send({ firstName: "Aniket", lastName: "Shinde" });
// });

// if there is anything starting and ending with fly, it will work
// app.get(/.*fly$/, (req, res) => {
//     res.send({ firstName: "Aniket", lastName: "Shinde" });
// });

// In this you will get the request parameters like userId and other parameters etc.
// like after `?` -> ?userId=101&password=test
// app.get("/user", (req, res) => {
//     console.log(req.query);
//     res.send({ firstName: "Aniket", lastName: "Shinde" });
// });

// if you want a dynamic route then you can use this
// app.get("/user/:userId") then you have to use req.params
// if you have multiple dynamic routes than you have to add them like this -> /user/:userId/:userName/:password
app.get("/user/:userId", (req, res) => {
    console.log(req.params);
    res.send({ firstName: "Aniket", lastName: "Shinde" });
});

app.listen(7777, () => {
    console.log("Server is successfully listening to port 7777...");
});
