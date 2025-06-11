# DevTinder API

## authRouter

-   POST /signup
-   POST /login
-   POST /logout

## profileRouter

-   GET /profile/view
-   PATCH /profile/edit
-   PATCH /profile/password

## connectionRequestRouter

<!-- so instead of creating 2 different api we can create one -->
<!-- -   POST /request/send/interested/:userId
-   POST /request/send/ignored/:userId -->
<!-- -   POST /request/review/accepted/:requestId
-   POST /request/review/rejected/:requestId -->

-   POST /request/send/:status/:userId
-   POST /request/review/:status/:requestId

## userRouter

-   GET /user/requests/received
-   GET /user/connections
-   GET /user/feed - Get you the profile of the user on platform

Status: ignored, interested, accepted, rejected
