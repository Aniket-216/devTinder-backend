const express = require("express");
const { adminAuth, userAuth } = require("../middlewares/auth");

const app = express();

/**
 * * so as you can see we are handling a logic for authentication but if are re-writing the auth logic again and again instead we have use the middleware
 * 
 *  app.get("/admin/getAllData", (req, res) => {
        // logic of checking if the request is authorized.
        const token = "xyz";
        const isAdminAuthorized = token === "xyz";
        if (isAdminAuthorized) {
            res.send("All data sent");
        } else {
            return res.status(401).send("Unauthorized");
        }
    });
 *  app.get("/admin/deleteUser", (req, res) => {
        // logic of checking if the request is authorized.
        const token = "xyz";
        const isAdminAuthorized = token === "xyz";
        if (isAdminAuthorized) {
            res.send("deleted user");
        } else {
            return res.status(401).send("Unauthorized");
        }
    });
 *
 */

// handle Auth middleware for all GET, POST, PUT, DELETE, and etc all requests.
// app.use("/admin", (req, res, next) => {
//     const token = "xyz";
//     const isAdminAuthorized = token === "xyz";
//     if (!isAdminAuthorized) {
//         res.status(401).send("Unauthorized");
//     } else {
//         next();
//     }
// });

// there is another way to handle the middleware

app.use("/admin", adminAuth);

/**
 *  this will not use the middleware auth because it is not under the /admin route.
 *  we can also use the middleware function inside the route.
 * so we don't need the middleware function for every route until and unless we need it. like you can see in the below example
 */

app.get("/user/login", (req, res) => {
    res.send("admin data sent");
});
app.get("/user/data", userAuth, (req, res) => {
    res.send("user data sent");
});

// logic of checking if the request is authorized.
app.get("/admin/getAllData", (req, res) => {
    res.send("All data sent");
});
app.get("/admin/deleteUser", (req, res) => {
    res.send("deleted user");
});

/**
 * * so the parameter is (err, req, res, next)
 */

app.get("/getUserData", (req, res) => {
    throw new Error("Internal server error");
    res.send("user data sent");
    // res.status(500).send("Internal server error");
});

// when handling error always put the error handler at the end of the middleware stack
app.use("/", (err, req, res) => {
    if (err) {
        res.status(500).send("Something went wrong");
    }
});

app.listen(7777, () => {
    console.log("Server is successfully listening to port 7777...");
});
