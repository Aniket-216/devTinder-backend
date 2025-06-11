const express = require("express");

const app = express();

/**
 * * if we use `app.use` then it will be used for all the HTTP methods
 * * if we don't send the any response then it will go infinite loop
 * * one route can have a multiple route handler
 *
 * * When we have multiple route handler, then it will only execute the first route handler.
 * * If we want to execute all the route handlers then we need to use `next()` function which is used to execute the next route handler.
 *
 * * now if you sent the res in the first route handle then it will not execute the next route handler and it will give you the error
 *
 * * you can wrap the route inside a `[]`. It will work the same way & it will work in all the HTTP methods.
 * */

// app.use("/route", rh1, rh2, rh3, rh4);
// app.use("/route", [rh1, rh2, rh3, rh4]);

app.use("/user", [
    (req, res, next) => {
        // route handler
        // res.send("Route handler 1");
        next();
    },
    (req, res, next) => {
        // route handler
        // res.send("Route handler 2");
        next();
    },
    (req, res, next) => {
        // route handler
        res.send("Route handler 3");
        next();
    },
    (req, res, next) => {
        // route handler
        // res.send("Route handler 4");
        // next();
    },
]);

app.listen(7777, () => {
    console.log("Server is successfully listening to port 7777...");
});
