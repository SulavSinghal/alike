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

combined the above two 
post/request/send/:status/:userId

POST/request/review/:status/:requestId

#userRouter
GET /connections
GET /requests/received
GET /feed - sets you the profiles of other users in interfaces

