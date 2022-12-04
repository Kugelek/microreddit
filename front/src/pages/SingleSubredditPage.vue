<template>
  <div>
    <Topbar />
    <h1 class="heading">Posty w subreddicie {{ $route.params.subredId }}</h1>

    <router-link to="/">Powrót do listy subredditów</router-link>
    <section class="add-post subscribers">
      <h3>
        There are {{ subscribersCount }} people who joined subreddit
        {{ $route.params.subredId }}
      </h3>

      <button class="button-primary" v-if="!haveIJoined" @click="join">
        Join subreddit!
      </button>
      <button class="button-primary" v-else disabled>Already joined</button>
      {{ joinResponse }}
    </section>
    <section v-if="haveIJoined" class="add-post">
      <h1 class="add-post__heading">Add new post</h1>
      <label class="label-name">
        <span>Post name</span>
        <input v-model="title" class="add-post__name" type="text" />
      </label>
      <label class="label-content">
        <span>Post content</span>
        <textarea v-model="content" class="add-post__content" />
      </label>
      <label class="label-img">
        <span>Image</span>
        <input
          @change="upload($event)"
          :disabled="uploadLocked"
          id="file"
          class="add-post__img"
          type="file"
        />
      </label>
      <label class="label-video">
        <span>Video url</span>
        <input
          v-model="video_url"
          class="add-post__video"
          type="url"
          placeholder="youtube.com/..."
        />
      </label>
      <button @click="addPost" class="button-primary">Nowy post</button>
      <h3>{{ addResponse }}</h3>
    </section>

    <SearchField @search="search" />
    <section v-if="filteredPosts.length" class="post-list">
      <h2>Lista postów</h2>
      <div class="post" :key="post.id" v-for="post in filteredPosts">
        <router-link
          :to="{ name: 'SinglePostPage', params: { postId: post.id } }"
          ><button class="button-primary show-details">
            Show details
          </button></router-link
        >
        <button
          class="button-primary"
          v-if="amIModerator || isModeratedByMe"
          @click="deletePost(post.id)"
        >
          Usuń post
        </button>
        <div class="left">
          <img
            class="post__img"
            :src="getPath(post.image_path)"
            alt="post thumbnail"
          />
        </div>
        <div class="right">
          <h3 class="post__name">{{ post.title }}</h3>
          <p class="post__details">
            by {{ post.author }} @ {{ post.creation_date }}
          </p>
          <p class="post__content">{{ post.content }}</p>
          <iframe class="video" width="420" height="315" :src="post.video_url">
          </iframe>
        </div>
      </div>
    </section>
    <section class="post-list" v-else>Nie znaleziono postów</section>

    <Footer />
  </div>
</template>

<script>
// import "../sharedStyles/ButtonPrimary.modules.scss";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import SearchField from "../components/SearchField.vue";

import BASE_LINK from "../httpConfig.js";
export default {
  name: "SubredditsWall",
  components: {
    Topbar,
    Footer,
    SearchField,
  },
  data() {
    return {
      posts: [],
      filteredPosts: [],
      subscribersCount: 0,
      haveIJoined: false,
      isModeratedByMe: false,
      joinResponse: "",
      showForm: false,
      title: "",
      content: "",
      image_path: "",
      video_url: "",
      uploadLocked: false,
      addResponse: "",
      amIModerator:
        localStorage.getItem("redditRole") === "moderator" ? true : false,
    };
  },
  methods: {
    getPath(path) {
      return path.replace("localhost", "localhost");
    },
    async deletePost(id) {
      console.log("TEST", id);
      fetch(`${BASE_LINK}api/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          this.fetchPosts();
        });
    },
    async addPost() {
      if (this.image_path === "") {
        this.addResponse = "Obrazek jest wymagany";
        return;
      }

      if (this.image_path.has("title")) this.image_path.delete("title");
      if (this.image_path.has("content")) this.image_path.delete("content");
      if (this.image_path.has("video_url")) this.image_path.delete("video_url");

      if (
        !this.title ||
        !this.content ||
        !this.video_url ||
        !this.uploadLocked
      ) {
        this.addResponse = "Wypełnij wszystkie dane";
        return;
      }
      this.image_path.append("title", this.title);
      this.image_path.append("content", this.content);
      this.image_path.append("video_url", this.video_url);
      fetch(`${BASE_LINK}api/subreddits/${this.$route.params.subredId}/post`, {
        method: "POST",
        credentials: "include",
        body: this.image_path,
      })
        .then((res) => {
          this.addResponse = res;
          return res.json();
        })
        .then((data) => {
          this.addResponse = data;
          this.fetchPosts();
        });
    },
    upload(event) {
      this.image_path = new FormData();
      this.uploadLocked = true;
      let file = event.target.files[0];

      this.image_path.append("file", file);
    },
    search(val, type) {
      if (val) {
        console.log(type);
        if (type === "name")
          this.filteredPosts = this.posts.filter((post) =>
            post.title.includes(val)
          );
        if (type === "description")
          this.filteredPosts = this.posts.filter((post) =>
            post.content.includes(val)
          );
      } else {
        this.filteredPosts = this.posts;
      }
    },
    toggleShowForm() {
      this.showForm = !this.showForm;
    },
    join() {
      fetch(`${BASE_LINK}api/subreddits/${this.$route.params.subredId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => {
          if (res.status === 200) {
            this.haveIJoined = true;
            this.subscribersCount += 1;
          }
          return res.json();
        })
        .then((data) => {
          this.joinResponse = data;
        });
    },

    async fetchPosts() {
      fetch(`${BASE_LINK}api/subreddits/${this.$route.params.subredId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => {
          console.log(res);

          return res.json();
        })
        .then((data) => {
          console.log(data);
          this.posts = data.posts;
          this.haveIJoined = data.haveIJoined;
          this.isModeratedByMe = data.isModeratedByMe;
          this.subscribersCount = data.subscribers.length;
          this.filteredPosts = data.posts;
          this.filteredPosts.forEach(
            (el) => (el.video_url = el.video_url.replace("watch?v=", "/embed/"))
          );
          //przygotuj dane
          // this.moderated = [...data.moderated];
          // this.subreddits = [...data.subreddits];
          // this.subreddits.forEach((subr) => {
          //   this.moderated.forEach((moderated) => {
          //     if (subr.id === moderated.subreddit_id) subr.moderated = true;
          //   });
          // });
          // console.log(this.subreddits);
        });
    },
  },
  created() {
    this.fetchPosts();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../sharedStyles/ButtonPrimary.modules.scss";
@import "../sharedStyles/StyledInput.modules.scss";
@import "../sharedStyles/ShadowBorderMixin.modules.scss";

.post__img {
  width: 20vw;
  height: 20vh;
}

.video {
  @media (max-width: 500px) {
    width: 75vw !important;
    height: 50vh !important;
    margin-left: -1.5rem;
    margin-top: 5vh;
  }
}

.show-details {
  width: 8vw !important;
  font-size: 1.5rem;
  margin-bottom: 3rem;
  @media (max-width: 1300px) {
    width: 20vw !important;
  }
  @media (max-width: 700px) {
    width: 35vw !important;
  }
}
.add-post {
  margin: auto;
  margin-top: 10vh;

  @include border-shadow-light;

  padding: 1.5rem;
  background-color: #efefef;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 35vw;
  & > * {
    padding: 1rem;
  }

  @media (max-width: 1000px) {
    width: 80vw;
  }
  @media (max-width: 500px) {
    width: 98vw;
  }

  &__name {
    width: 15vw;
  }
  &__content {
    width: 30vw;
    height: 15vh;
  }
}

a {
  text-decoration: none;
  color: #444;
}
.heading {
  margin-top: 5vh;
}
.post-list {
  margin: auto;
  margin-top: 10vh;
  padding: 1.5rem;
  margin-bottom: 20vh;
  background-color: #efefef;
  @include border-shadow;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 35vw;
  & > * {
    padding: 1rem;
  }

  @media (max-width: 1300px) {
    width: 90vw;
  }

  @media (max-width: 500px) {
    width: 100vw;
    margin-left: -2.5vw;
  }
}

.post {
  margin: auto;
  margin-top: 10vh;
  @include border-shadow-light;
  padding: 1.5rem;
  transition: 0.3s all ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 32vw;
  cursor: pointer;
  &__details {
    margin-bottom: 2rem;
    font-size: 0.7rem;
  }
  @media (max-width: 1300px) {
    width: 80vw;
  }
  @media (max-width: 500px) {
    width: 90vw;
  }
  // @media (max-width: 500px) {
  //   margin-left: -0.5vw;
  // }
}
.right {
  margin: 4rem 0;
}
</style>
