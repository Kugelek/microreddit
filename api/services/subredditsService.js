exports.getSingleSubreddit = async (client, req, res) => {
  const fetchedSubreddit = await client.query(
    "select * from subreddit where name = $1",
    [req.params.name]
  );
  if (!fetchedSubreddit || !fetchedSubreddit.rows[0])
    return res.status(404).json("not found");

  console.log(fetchedSubreddit.rows[0].id);

  const subscribers = await client.query(
    "select * from subreddit_user WHERE subreddit_id=$1",
    [fetchedSubreddit.rows[0].id]
  );

  // const subscribersData =

  const moderatedByMe = await client.query(
    "select * from subreddit_moderator WHERE user_id=$1 AND subreddit_id=$2",
    [req.user, fetchedSubreddit.rows[0].id]
  );
  let moderated = false;
  if (moderatedByMe && moderatedByMe.rows[0]) {
    moderated = true;
  }

  let haveIjoined = false;

  subscribers.rows.forEach((el) => {
    if (el.user_id === req.user) haveIjoined = true;
  });

  //fetch posts of subreddit
  const posts = await client.query("select * from post where subreddit_id=$1", [
    fetchedSubreddit.rows[0].id,
  ]);

  return res.json({
    subreddit: fetchedSubreddit.rows[0],
    isModeratedByMe: moderated,
    subscribers: subscribers.rows,
    posts: posts.rows,
    haveIJoined: haveIjoined,
  });
};

exports.joinSubreddit = async (client, req, res) => {
  if (!req.user) {
    return res.status(401).json("Unauthorized");
  }

  const subredditId = await client.query(
    "select * from subreddit WHERE name=$1",
    [req.params.name]
  );

  if (!subredditId && !subredditId.rows[0]) {
    return res.status(404).json("Subreddit not found");
  }

  const duplicateJoin = await client.query(
    "select * from subreddit_user WHERE user_id=$1 AND subreddit_id=$2",
    [req.user, subredditId.rows[0].id]
  );
  if (duplicateJoin && duplicateJoin.rows[0]) {
    return res.status(409).json("Already joined!");
  }

  await client.query(
    "insert into subreddit_user( user_id, subreddit_id) values ($1, $2) RETURNING ID",
    [req.user, subredditId.rows[0].id]
  );
  return res.status(200).json("Dołączono");
};

exports.getSubreddits = async (client, req, res) => {
  console.log("Subreddit", req.user);
  const subreddits = await client.query("select * from subreddit");

  const moderatedByMe = await client.query(
    "select * from subreddit_moderator WHERE user_id=$1",
    [req.user]
  );

  // await client.query("select * from subreddit_user WHERE user_id=$1", [row.id]);

  // const result = await fetchSubscribers(client, subreddits.rows);
  // console.log(result);
  // let result = [];
  // subreddits.rows.forEach((row)
  //  =>
  //   result.push(

  //   );
  // );

  //console.log(`${row.id} MA USEROW ${subscribers}`);

  // const joinedUsers = await client.query(
  //   "select * from subreddit_user WHERE user_id=$1",
  //   [req.user]
  // );

  return res.json({
    subreddits: subreddits.rows,
    moderated: moderatedByMe.rows,
  });
};

exports.addSubreddit = async (client, req, res) => {
  if (!req.user) {
    return res.status(401).json("Unauthorized");
  }
  if (req.body.name.length < 5 || req.body.description.length < 5) {
    return res.status(400).json("Za krótki opis/nazwa - minimum 5 znaków");
  }
  const duplicateSubreddit = await client.query(
    "select * from subreddit where name = $1",
    [req.body.name]
  );
  if (duplicateSubreddit && duplicateSubreddit.rows[0]) {
    return res.status(409).json("Istnieje juz subreddit o takiej nazwie");
  }

  const id = await client.query(
    "insert into subreddit( name, description) values ($1, $2) RETURNING ID",
    [req.body.name, req.body.description]
  );

  if (!id) {
    return res.status(404).json("Not found");
  }

  await client.query(
    "insert into subreddit_moderator( user_id, subreddit_id) values ($1, $2) RETURNING ID",
    [req.user, id.rows[0].id]
  );

  const subredditCandidate = await client.query(
    "select * from subreddit where id = $1",
    [id.rows[0].id]
  );

  return res.send(subredditCandidate.rows[0]);
};

exports.updateSubreddit = async (client, req, res) => {
  if (
    !req.body.name ||
    !req.body.description ||
    req.body.name.length < 3 ||
    req.body.description.length < 3
  )
    return res.status(400).json("Za mało danych, za krotkie dane");

  const duplicateSubreddit = await client.query(
    "select * from subreddit where name = $1",
    [req.body.name]
  );
  if (duplicateSubreddit && duplicateSubreddit.rows[0]) {
    return res.status(409).json("Istnieje juz subreddit o takiej nazwie");
  }

  await client.query(
    "update subreddit set name = $1, description = $2 where id = $3",
    [req.body.name, req.body.description, req.params.id]
  );
  const editedSubreddit = await client.query(
    "select * from subreddit where id = $1",
    [req.params.id]
  );
  return res.send(editedSubreddit.rows[0]);
};

exports.deleteSubreddit = async (client, req, res) => {
  const deletedSubreddit = await client.query(
    "select * from subreddit where id = $1",
    [req.params.id]
  );
  if (!deletedSubreddit.rows[0]) return res.status(404).send("Brak subredditu");

  await client.query("delete from subreddit where id = $1", [req.params.id]);
  return res.status(200).send("Usunieto");
};

exports.addPost = async (client, req, res) => {
  if (!req.user) {
    return res.status(401).json("Unauthorized");
  }

  console.log("FILE", req.file);
  console.log("1", req.body.title);
  const absoluteImgPath = "http://localhost:5000/" + req.file.path;

  //id subreddita o nazwie
  const fetchedSubreddit = await client.query(
    "select * from subreddit where name = $1",
    [req.params.name]
  );

  if (!fetchedSubreddit || !fetchedSubreddit.rows[0])
    return res.status(400).json("not found");

  if (
    !req.body.title ||
    !req.body.content ||
    req.body.title.length < 3 ||
    req.body.content.length < 3
  ) {
    return res.status(400).json("Wypełnij dobrze tytuł i content");
  }
  if (!req.body.video_url)
    return res.status(400).json("Wypełnij wszystkie dane");

  await client.query(
    "insert into post( title, content, image_path, video_url, creation_date, subreddit_id, user_id) values ($1, $2, $3, $4, $5, $6, $7) RETURNING ID",
    [
      req.body.title,
      req.body.content,
      absoluteImgPath,
      req.body.video_url,
      new Date(),
      fetchedSubreddit.rows[0].id,
      req.user,
    ]
  );
  return res.status(200).json("Dodano post");
};
