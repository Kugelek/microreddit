// var express = require("express");
// var router = express.Router();
// var passport = require("passport");

// router.post("/login", passport.authenticate("local"), (req, res) => {
//   console.log("miejsce loginu", req.user);
//   return res.send("Succesfully logged in");
// });

// router.post("/logout", (req, res) => {
//   console.log(`logout ${req.session.id}`);
//   //logout sockets if needed
//   req.logout();
//   res.cookie("connect.sid", "", { expires: new Date() });
//   res.send("Succesfully logged out");
// });

// passport.serializeUser((user, serializationCallback) => {
//   console.log(`serialized user ${user.id}`);
//   serializationCallback(null, user.id);
// });

// passport.deserializeUser(async (id, deserializationCallback) => {
//   //   const usersMatchingCredentials = await client.query(
//   //     "select * from reddit_user where email = $1 AND password = $2",
//   //     [username, password]
//   //   );
//   //   const authorizedUser = usersMatchingCredentials.rows[0];
//   //   const credentialsDTO = {
//   //     id: authorizedUser.id,
//   //     nickname: authorizedUser.nickname,
//   //     email: authorizedUser.email,
//   //   };
//   console.log(`deserialized user ${id}`);
//   deserializationCallback(null, id);
// });

// module.exports = router;
