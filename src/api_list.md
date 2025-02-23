#Auth Router
post /signup
post /login
post /logout

#profileRouter
get / profile - viewing the profile
patch /profile - updating the profile
patch /profile/password // forget password API

#connectionrequestRouter
post/request/send/Interested/:userId
post/request/send/ignored/:userid
POST/request/review/accepted/:reqId
POST/request/review/rejected/:reqId

#userRouter
GET /connections
GET /requests/received
GET /feed - sets you the profiles of other users in interfaces

