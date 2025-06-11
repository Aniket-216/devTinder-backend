const express = require("express");

const app = express();

/**
 * * It checks all the app.xxx(matching route) functions
 * * GET /user => middleware chain => request handler
 * 
 *   These are the middleware functions 
 *  (req, res, next) => { 
 *      res.send("Route handler 1");
 *      next();
    },
 */

app.use("/user", (req, res, next) => {
    // res.send("Route handler");
    next();
});
app.get(
    "/user",
    (req, res, next) => {
        // res.send("Route handler 1");
        next();
    },
    (req, res, next) => {
        res.send("Route handler 1");
        next();
    }
);

app.listen(7777, () => {
    console.log("Server is successfully listening to port 7777...");
});
