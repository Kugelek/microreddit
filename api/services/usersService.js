exports.getUsers = async (client, req, res) => {
  console.log(req.user);
  const fetchedUsers = await client.query("select * from reddit_user");
  return res.send(fetchedUsers.rows);
};

exports.getMyProfile = async (client, req, res) => {
  if (!req.user) {
    res.status(401).json("Unauthorized");
  }

  const myProfile = await client.query(
    "select * from reddit_user WHERE id=$1",
    [req.user]
  );

  if (myProfile && myProfile.rows[0]) {
    res.status(200).json(myProfile.rows[0]);
  } else {
    res.status(404).json("Nie znaleziono użytkownika");
  }

  // const alreadyExistingUser = await client.query(
  //   "select * from reddit_user where email = $1",
  //   [req.body.email]
  // );

  // console.log(req.user);
  // const fetchedUsers = await client.query("select * from reddit_user");
  // return res.send(fetchedUsers.rows);
};

exports.editMyPassword = async (client, req, res) => {
  if (!req.user) {
    return res.status(401).json("Unauthorized");
  }

  if (req.body.password === "") {
    return res.status(400).json("Proponowane nowe hasło jest niepoprawne.");
  }

  const myProfile = await client.query(
    "select * from reddit_user WHERE id=$1",
    [req.user]
  );
  if (!myProfile || myProfile.rows[0].password !== req.body.oldPassword) {
    return res.status(401).json("Błędne hasło");
  } else {
    await client.query("update reddit_user set password = $1 where id = $2", [
      req.body.password,
      req.user,
    ]);
    res.status(200).json("Pomyślnie ustawiono nowe hasło");
  }
};

exports.editMyNickname = async (client, req, res) => {
  if (!req.user) {
    return res.status(401).json("Unauthorized");
  }
  if (req.body.nickname === "") {
    return res.status(400).json("Proponowany nick jest niepoprawny.");
  }

  const myProfile = await client.query(
    "select * from reddit_user WHERE id=$1",
    [req.user]
  );
  if (!myProfile || myProfile.rows[0].password !== req.body.oldPassword) {
    return res.status(401).json("Błędne hasło");
  }

  await client.query("update reddit_user set nickname = $1 where id = $2", [
    req.body.nickname,
    req.user,
  ]);
  res.status(200).json("Pomyślnie ustawiono nowy nick");
};
