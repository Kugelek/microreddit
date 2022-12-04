<template>
  <div>
    <Topbar />
    <h1 class="heading">Zapoznaj się z postem i komentarzami</h1>
    <h4><router-link to="/"> Powrót do strony głównej</router-link></h4>

    <section v-if="post.id && post.id != -1" class="post">
      <div class="left">
        <div class="post__score">Ocena uzytkownikow: {{ suma }}</div>
        <div v-if="auth">
          <button class="btnvoted" v-if="alreadyVoted" disabled>
            Juz zagłosowałeś
          </button>
          <div v-else class="post__rate">
            <div class="btn-group" role="group" aria-label="Basic example">
              <button @click="vote(1)" class="post__upvote btn btn-success">
                +1
              </button>
              <button @click="vote(-1)" class="post__upvote btn btn-danger">
                -1
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <h3 class="post__name">{{ post.title }}</h3>
        <p class="post__details">
          Created at {{ post.creation_date.split("T")[0] || "brak daty" }}
        </p>
        <p class="post__content">{{ post.content }}</p>
        <div class="post__mediacontainer">
          <img class="post__img" :src="getPath()" alt="post thumbnail" />
          <iframe class="post__video" :src="post.video_url"> </iframe>
        </div>
      </div>
    </section>
    <section v-else>Post został usunięty.</section>

    <section v-if="post.id && post.id != -1" class="comments">
      <h3>Komentarze pod postem</h3>
      <section v-if="myId != -1" class="add-comment">
        <p class="add-comment__label">Dodaj komentarz</p>
        <input
          v-model="commentContent"
          type="text"
          class="add-comment__content"
        />
        <button @click="addComment" class="btn add-comment__submit">
          Wyślij komentarz
        </button>
      </section>
      <div class="comment" :key="comment.id" v-for="comment in comments">
        <p class="comment__author">{{ comment.nickname }}</p>
        <p class="comment__content">{{ comment.content }}</p>
        <button
          v-if="amISubredditMod || moderatedByMe"
          @click="deleteComment(comment.id)"
        >
          Usuń
        </button>
      </div>
    </section>
    <section v-else>Post został usunięty. Nie ma zatem komentarzy</section>
    <Footer />
  </div>
</template>

<script>
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import io from "@/socket.connector.js";

import BASE_LINK from "../httpConfig.js";
export default {
  name: "RegisterPage",
  components: {
    Topbar,
    Footer,
  },
  data() {
    return {
      suma: 0,
      auth: false,
      alreadyVoted: false,
      post: {
        // id: 1,
        // subreddit: 3,
        // name: "cos",
        // content: "post o komputerach",
        // author: "Piotr",
        // img: "https://source.unsplash.com/random/200x200?sig=6",
        // date: new Date(),
      },
      comments: [],
      commentContent: "",
      myId: -1,
      moderatedByMe: false,
      amISubredditMod:
        localStorage.getItem("redditRole") === "moderator" ? true : false,
    };
  },
  methods: {
    getPath() {
      return this.post.image_path.replace("localhost", "localhost");
    },
    addComment() {
      if (this.myId == -1) return;
      const data = {
        content: this.commentContent,
        userId: this.myId,
        postId: this.$route.params.postId,
      };
      io.emit("addComment", data);
    },
    deleteComment(id) {
      if (this.myId == -1) return;
      const data = {
        commentId: id,
        postId: this.$route.params.postId,
      };
      console.log(data);
      io.emit("deleteComment", data);
    },
    // deleteComment(){
    //  io.emit("deleteComment", (updatedComments) =>{

    //   })
    // },
    vote(value) {
      console.log(value);
      console.log(this.$route.params.postId);

      fetch(`${BASE_LINK}api/posts/${this.$route.params.postId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          rate: value,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          this.fetchSinglePost();
          // console.log(data);
          // console.log(data.posts);
          // this.suma = data.suma;
          // this.post = data.posts;
          // this.auth = data.auth;
          // this.alreadyVoted = data.alreadyVoted;
          // this.post.video_url = this.post.video_url.replace(
          //   "watch?v=",
          //   "/embed/"
          // );
        });
    },
    async fetchMyId() {
      fetch(`${BASE_LINK}auth/myid`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => {
          console.log("test");

          return res.json();
        })
        .then((data) => {
          this.myId = data;
          console.log("id", data);
        });
    },

    async fetchSinglePost() {
      fetch(`${BASE_LINK}api/posts/${this.$route.params.postId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => {
          console.log("test");

          return res.json();
        })
        .then((data) => {
          console.log(data);
          console.log(data.posts);
          this.suma = data.suma;
          this.post = data.posts;
          this.auth = data.auth;
          this.moderatedByMe = data.moderatedByMe;
          this.alreadyVoted = data.alreadyVoted;
          this.post.video_url = this.post.video_url.replace(
            "watch?v=",
            "/embed/"
          );
        });
    },
    async fetchComments() {
      fetch(`${BASE_LINK}api/posts/${this.$route.params.postId}/comments`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => {
          console.log("test");

          return res.json();
        })
        .then((comments) => {
          console.log(comments);
          this.comments = comments;
        });
    },
  },
  created() {
    this.fetchSinglePost();
    this.fetchComments();
    this.fetchMyId();
  },
  mounted() {
    io.on("commentsUpdated", (updatedComments) => {
      console.log(updatedComments);
      if (
        // updatedComments &&
        // updatedComments[0] &&
        // updatedComments[0].post_id * 1 === this.$route.params.postId * 1
        updatedComments.postId * 1 ===
        this.$route.params.postId * 1
      )
        this.comments = updatedComments.comments;
      // const comms = updatedComments.filter(
      //   (comm) => comm.post_id * 1 === this.$route.params.postId * 1
      // );
      // console.log(comms);
    });

    io.on("postDeleted", (data) => {
      console.log(data);

      console.log(this.post.id);
      if (data.postId * 1 == this.post.id * 1) {
        this.post.id = -1;
        // this.post = undefined;
      }
      console.log(this.post.id);
    });

    io.on("somebodyVoted", (data) => {
      if (data.postId * 1 == this.post.id * 1) {
        this.suma = data.sum;
      }
      console.log("SUMASOCKETY", this.suma);
    });

    // io.on("commentDeleted", (updatedComments) => {
    //    this.comments = updatedComments
    //   // console.log(e);
    //   // this.postsFetchedSockets = this.postsFetchedSockets.filter(
    //   //   (el) => el === e.content
    //   // );
    // });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../sharedStyles/ButtonPrimary.modules.scss";
@import "../sharedStyles/StyledInput.modules.scss";
@import "../sharedStyles/ShadowBorderMixin.modules.scss";
a {
  text-decoration: none;
  color: #444;
}
.heading {
  margin-top: 5vh;
}
.post__img {
  width: 20vw;
  height: 20vh;
  margin: 2rem;
  @media (max-width: 600px) {
    width: 40vw;
    height: 40vh;
  }
}

.btnvoted {
  margin-bottom: 4rem;
}

.post {
  margin: auto;
  margin-top: 10vh;
  @include border-shadow;
  background-color: $box-background;
  padding: 1.5rem;
  transition: 0.3s all ease-in-out;
  display: flex;
  justify-content: space-evenly;
  // align-items: flex-start;
  width: 58vw;
  cursor: pointer;

  &__rate {
    @media (max-width: 400px) {
      margin-bottom: 5rem;
    }
  }

  @media (max-width: 800px) {
    width: 90vw;
  }

  @media (max-width: 400px) {
    flex-direction: column;
  }
  &__mediacontainer {
    display: flex;
    @media (max-width: 800px) {
      flex-direction: column;
    }
  }
  &__details {
    margin-bottom: 2rem;
    font-size: 0.7rem;
  }
  &__video {
    margin-top: 2rem;
    width: 25vw !important;
    height: 25vh !important;
    @media (max-width: 600px) {
      width: 40vw !important;
      height: 40vh;
    }
  }
}
.right {
  margin-right: 3rem;
}
.left {
  display: flex;
  flex-direction: column;
}

.comments {
  margin: auto;
  margin-top: 10vh;
  @include border-shadow-light;
  background-color: $box-background;
  padding: 1.5rem;
  transition: 0.3s all ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 28vw;
  cursor: pointer;
  margin-bottom: 20vh;
  @media (max-width: 800px) {
    width: 90vw;
  }
}
.comment {
  margin: auto;
  margin-top: 10vh;
  @include border-shadow-light;
  background-color: $box-background;
  padding: 1.5rem;
  margin-bottom: 20vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 25vw;
  @media (max-width: 800px) {
    width: 75vw;
  }
  &__author {
    align-self: flex-start;
  }
}
</style>
