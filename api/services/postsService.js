exports.getAllPosts = async (client, req, res) => {
  if (!req.user) {
    return res.status(401).json("Unauthorized");
  }
  // fetch posts of subreddit
  const posts = await client.query("select * from post");

  return res.json({
    posts: posts.rows,
  });
};

exports.getSinglePost = async (client, req, res) => {
  let auth = false;
  if (req.user) {
    auth = true;
  }

  const posts = await client.query("select * from post WHERE id=$1", [
    req.params.id,
  ]);

  const oceny = await client.query("select * from post_vote WHERE post_id=$1", [
    req.params.id,
  ]);

  console.log("ALL", oceny.rows);

  const myOceny = await client.query(
    "select * from post_vote WHERE post_id=$1 AND user_id=$2",
    [req.params.id, req.user]
  );

  const sumka = oceny.rows.reduce((acc, ocena) => acc + ocena.vote * 1, 0);

  let alreadyVoted = false;
  console.log(myOceny.rows[0]);
  if (myOceny && myOceny.rows[0]) {
    console.log(myOceny.rows[0]);
    console.log(myOceny.rows);
    alreadyVoted = true;
  }

  if (!posts || !posts.rows[0]) return res.status(404).json("Post not found");

  //get id subreddita na podstawie id posta

  const moderatedByMe = await client.query(
    "select * from subreddit_moderator WHERE user_id=$1 AND subreddit_id=$2 ",
    [req.user, posts.rows[0].subreddit_id]
  );

  let isModeratedByMe = false;
  if (moderatedByMe && moderatedByMe.rows[0]) {
    isModeratedByMe = true;
  }

  return res.status(200).json({
    posts: posts.rows[0],
    oceny: oceny.rows,
    suma: sumka,
    alreadyVoted,
    auth,
    moderatedByMe: isModeratedByMe,
  });
};

// exports.ratePost = async (client, req, res) => {
//   if (!req.user) {
//     return res.status(401).json("Unauthorized");
//   }

//   //szukaj duplikatu
//   const duplikat = await client.query(
//     "select * from post_vote WHERE post_id=$1 AND user_id=$2",
//     [req.params.id, req.user]
//   );

//   if (duplikat && duplikat.rows[0]) {
//     return res.status(409).json("Duplikat głosu");
//   }

//   await client.query(
//     "insert into post_vote( vote, user_id, post_id) values ($1, $2, $3) RETURNING ID",
//     [req.body.rate, req.user, req.params.id]
//   );
//   return res.status(200).json("Oceniono");
// };

exports.getPostComments = async (client, req, res) => {
  //sprawdz czy post istnieje

  const postComments = await client.query(
    "select comment.id, comment.content, user_id,post_id, nickname from comment INNER JOIN reddit_user ON comment.user_id=reddit_user.id WHERE post_id=$1",
    [req.params.id]
  );

  if (!postComments && !postComments.rows[0])
    return res.status(404).json("Brak postów");
  return res.status(200).json(postComments.rows);
};

//  db.query(`INSERT INTO comment (content, parent_comment_id, user_id, post_id) VALUES
