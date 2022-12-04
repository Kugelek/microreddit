// exports.login = async (client, req, res) => {
//   // const deletedTodo = await client.query(
//   //   "select * from todoposts where id = $1",
//   //   [req.params.id]
//   // );
//   // if (!deletedTodo.rows[0]) return res.status(404).send("Brak zadania todo");
//   // await client.query("delete from todoposts where id = $1", [req.params.id]);
//   // //   io.emit("postDeleted", deletedTodo.rows[0]);
//   // return res.status(200).send("Usunieto");
// };

// exports.register = async (client, req, res) => {};

// var express = require("express");
// var router = express.Router();
var passport = require("passport");

// let { passport } = require("../app");

// exports.login = async (client, req, res) => {

exports.register = async (client, req, res) => {
  if (
    !req.body.nickname ||
    !req.body.password ||
    !req.body.repeatPassword ||
    !req.body.email
  )
    return res.status(400).json("Za malo danych");

  //zwaliduj regexem mail
  const mailRegex = /\S+@\S+\.\S+/;
  if (!mailRegex.test(req.body.email)) {
    return res.status(400).json("Niepoprawny format maila");
  }
  //zwaliduj unikalnosc maila
  const alreadyExistingUser = await client.query(
    "select * from reddit_user where email = $1",
    [req.body.email]
  );
  if (alreadyExistingUser && alreadyExistingUser.rows[0]) {
    return res.status(409).json("User o takim mailu juz istnieje!");
  }
  if (req.body.password !== req.body.repeatPassword) {
    return res.status(400).json("Hasła nie są identyczne");
  }

  const addedUserId = await client.query(
    "insert into reddit_user( nickname, activation_guid, activation_expire_date, password, email ) values ($1, null, null, $3, $2) RETURNING ID",
    [req.body.nickname, req.body.email, req.body.password]
  );

  if (addedUserId) {
    return res.status(200).json("Zarejestrowales sie pomyslnie!");
  } else {
    return res.status(500).json("Cos poszło nie tak");
  }
};

exports.myID = async (req, res) => {
  if (!req.user) return res.status(401).json(-1);
  return res.status(200).json(req.user);
};

exports.login = async (client, req, res) => {
  console.log(req.user.id);
  const foundUser = await client.query(
    "select * from reddit_user where id = $1",
    [req.user.id]
  );

  let role;
  if (foundUser) {
    role = await client.query("select * from user_role where user_id = $1", [
      foundUser.rows[0].id,
    ]);
    console.log("ROLE", role.rows[0]);
  }

  let roleName;
  if (role && role.rows[0]) {
    roleName = await client.query("select * from role where id = $1", [
      role.rows[0].role_id,
    ]);
  }

  const foundUserRow = foundUser.rows[0];

  let outputRole;
  if (roleName && roleName.rows[0]) {
    outputRole = roleName.rows[0].role_name;
  } else {
    outputRole = "user";
  }
  return res.json({ ...foundUserRow, role: outputRole });
};

exports.logout = async (client, req, res) => {
  console.log(`logout ${req.session.id}`);
  req.logout();
  res.cookie("connect.sid", "", { expires: new Date() });
  res.send("Succesfully logged out");
};

passport.serializeUser((user, serializationCallback) => {
  console.log(`serialized user ${user.id}`);
  serializationCallback(null, user.id);
});

passport.deserializeUser(async (id, deserializationCallback) => {
  // const usersMatchingCredentials = await client.query(
  //   "select * from reddit_user where email = $1 AND password = $2",
  //   [username, password]
  // );
  //   const authorizedUser = usersMatchingCredentials.rows[0];
  //   const credentialsDTO = {
  //     id: authorizedUser.id,
  //     nickname: authorizedUser.nickname,
  //     email: authorizedUser.email,
  //   };
  console.log(`deserialized user ${id}`);
  deserializationCallback(null, id);
});

// module.exports = router;
