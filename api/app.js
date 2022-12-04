const express = require("express");
const app = express();
const cors = require("cors");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
const session = require("express-session");

const authRouter = require("./routes/auth");
const subredditsService = require("./services/subredditsService");
const postsService = require("./services/postsService");
const usersService = require("./services/usersService");
const authService = require("./services/authService");
const { initAllTables } = require("./utils/initDatabaseTables");
const { fillDatabase, fillTest } = require("./utils/fillDatabaseWithData");

const isAuthenticated = require("./middlewares/auth");

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

const sessionMiddleware = session({
  secret: "KOCHAMpromisyORAZjaveskrypt",
  resave: false,
  saveUninitialized: false,
});

const passport = require("passport");

const corsOptions = {
  // origin: "http://localhost:8080",
  origin: "http://localhost:5000",
  credentials: true,
};
app.use("/uploads", express.static("uploads"));
app.use("", express.static("../front/dist/"));
app.use(logger("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sessionMiddleware);
app.use(passport.initialize());

const LocalStrategy = require("passport-local").Strategy;

const DUMMY_USER = {
  id: 1,
  username: "john",
};
passport.initialize();
passport.use(
  new LocalStrategy(async (username, password, done) => {
    //TODO: find user by credentials
    // const fetchedUsers = await client.query("select * from reddit_user");
    const usersMatchingCredentials = await client.query(
      "select * from reddit_user where email = $1 AND password = $2",
      [username, password]
    );
    const authorizedUser = usersMatchingCredentials.rows[0];
    // console.log("MATCHED", usersMatchingCredentials.rows[0]);
    if (authorizedUser) {
      const credentialsDTO = {
        id: authorizedUser.id,
        nickname: authorizedUser.nickname,
        email: authorizedUser.email,
      };
      console.log("authentication OK", credentialsDTO);
      // return done(null, DUMMY_USER);
      return done(null, credentialsDTO);
    } else {
      console.log("wrong credentials");
      return done(null, false);
    }
    // if (username === "john" && password === "doe") {
    //   console.log("authentication OK");
    //   return done(null, DUMMY_USER);
    // } else {
    //   console.log("wrong credentials");
    //   return done(null, false);
    // }
  })
);
app.use(passport.session());

passport.deserializeUser((id, done) => {
  console.log("DESE");
  console.log("test", id);
  done(null, DUMMY_USER);
});
passport.serializeUser((user, done) => {
  console.log("SERIALI");
  done(null, user.id);
});

require("dotenv").config();
const dbConnData = {
  host: process.env.PGHOST || "127.0.0.1",
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE || "reddit",
  user: process.env.PGUSERNAME || "postgres",
  password: process.env.PASSWORD || "postgres",
};

const { Client } = require("pg");
const client = new Client(dbConnData);
const { Server } = require("socket.io");

let io;
client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
    const serwer = app.listen(5000, "localhost", () => {
      // console.log(`listening at http://localhost:${5000}`);
    });
    io = new Server(serwer, {
      cors: {
        origin: "*",
      },
    });
    io.use(function (socket, next) {
      sessionMiddleware(socket.request, {}, next);
    }).on("connection", (socket) => {
      socket.on("addComment", async (data) => {
        await client.query(
          "insert into comment( content, parent_comment_id, user_id, post_id) values ($1, null, $2, $3) RETURNING ID",
          [data.content, data.userId, data.postId]
        );

        const postComments = await client.query(
          "select comment.id, comment.content, user_id,post_id, nickname from comment INNER JOIN reddit_user ON comment.user_id=reddit_user.id WHERE post_id=$1",
          [data.postId]
        );

        if (!postComments && !postComments.rows[0]) return;
        io.sockets.emit("commentsUpdated", {
          comments: postComments.rows,
          postId: data.postId,
        });
        // return res.status(200).json(postComments.rows);
        console.log(data);
      });

      // .use(function (socket, next) {
      //   sessionMiddleware(socket.request, {}, next);
      // })

      socket.on("deleteComment", async (data) => {
        console.log(data.commentId);
        // console.log(commentId);
        await client.query("delete from comment WHERE id=$1", [data.commentId]);

        const postComments = await client.query(
          "select comment.id, comment.content, user_id,post_id, nickname from comment INNER JOIN reddit_user ON comment.user_id=reddit_user.id WHERE post_id=$1",

          [data.postId]
        );
        // console.log(postComments);

        if (!postComments && !postComments.rows[0]) return;
        io.sockets.emit("commentsUpdated", {
          comments: postComments.rows,
          postId: data.postId,
        });
      });
    });

    app.set("socketio", io);
    // app.use("/auth", authRouter);
    const router = express.Router();
    router
      .route("/auth/login")
      .post(
        passport.authenticate("local"),
        authService.login.bind(this, client)
      );
    router.route("/auth/logout").post(authService.logout.bind(this, client));

    router.route("/auth/myid").get(authService.myID);
    router
      .route("/auth/register")
      .post(authService.register.bind(this, client));

    router
      .route("/api/subreddits")
      .get(subredditsService.getSubreddits.bind(this, client))
      .post(subredditsService.addSubreddit.bind(this, client));
    router
      .route("/api/subreddits/:id")
      .put(subredditsService.updateSubreddit.bind(this, client))
      .delete(subredditsService.deleteSubreddit.bind(this, client));

    router
      .route("/api/subreddits/:name")
      .get(subredditsService.getSingleSubreddit.bind(this, client))
      .post(subredditsService.joinSubreddit.bind(this, client));
    router
      .route("/api/subreddits/:name/post")
      .post(
        upload.single("file"),
        subredditsService.addPost.bind(this, client)
      );

    router.route("/api/posts").get(postsService.getAllPosts.bind(this, client));

    router
      .route("/api/posts/:id")
      .get(postsService.getSinglePost.bind(this, client))
      .post(ratePost.bind(this, client))
      .delete(deletePost.bind(this, client));
    router
      .route("/api/posts/:id/comments")
      .get(postsService.getPostComments.bind(this, client));

    router.route("/api/users").get(usersService.getUsers.bind(this, client));
    router
      .route("/api/users/profile")
      .get(usersService.getMyProfile.bind(this, client));
    router
      .route("/api/users/profile/password")
      .patch(usersService.editMyPassword.bind(this, client));
    router
      .route("/api/users/profile/nickname")
      .patch(usersService.editMyNickname.bind(this, client));

    app.use("/", router);
  })
  .catch((err) => console.error("Connection error", err.stack));

const initDatabase = () => {
  initAllTables(client);
  // fillTest(client);
  // fillDatabase(client);
};

initDatabase();

const deletePost = async (client, req, res) => {
  if (!req.user) {
    return res.status(401).json("Unauthorized");
  }

  await client.query("delete from comment WHERE post_id=$1", [req.params.id]);

  await client.query("delete from post_vote WHERE post_id=$1", [req.params.id]);

  await client.query("delete from post WHERE id=$1", [req.params.id]);

  io.sockets.emit("postDeleted", {
    postId: req.params.id,
  });

  // const postComments = await client.query(
  //   "select comment.id, comment.content, user_id,post_id, nickname from comment INNER JOIN reddit_user ON comment.user_id=reddit_user.id WHERE post_id=$1",

  //   [data.postId]
  // );

  return res.status(200).json("Deleted");
};

const ratePost = async (client, req, res) => {
  if (!req.user) {
    return res.status(401).json("Unauthorized");
  }

  //szukaj duplikatu
  const duplikat = await client.query(
    "select * from post_vote WHERE post_id=$1 AND user_id=$2",
    [req.params.id, req.user]
  );

  if (duplikat && duplikat.rows[0]) {
    return res.status(409).json("Duplikat głosu");
  }

  await client.query(
    "insert into post_vote( vote, user_id, post_id) values ($1, $2, $3) RETURNING ID",
    [req.body.rate, req.user, req.params.id]
  );

  //get voty
  const oceny = await client.query("select * from post_vote WHERE post_id=$1", [
    req.params.id,
  ]);

  const sumka = oceny.rows.reduce((acc, ocena) => acc + ocena.vote * 1, 0);

  io.sockets.emit("somebodyVoted", {
    postId: req.params.id,
    sum: sumka,
  });

  return res.status(200).json("Oceniono");
};
