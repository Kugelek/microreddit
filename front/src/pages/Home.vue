<template>
  <div>
    <Topbar />

    <div>
      <h1>Home uzytkownika</h1>
      <SearchField @search="search" />
      <h4>Sortuj po dacie</h4>
      <label>
        Rosnaco
        <input
          v-model="isSortAscending"
          name="sort"
          id="asc"
          value="true"
          type="radio"
      /></label>
      <label>
        Malejaco
        <input
          v-model="isSortAscending"
          name="sort"
          id="desc"
          value="false"
          type="radio"
      /></label>
    </div>
    <section v-if="filteredPosts.length" class="post-list">
      <div class="post" :key="post.id" v-for="post in filteredPosts">
        <router-link
          :to="{ name: 'SinglePostPage', params: { postId: post.id } }"
          ><button class="button-primary">Show details</button></router-link
        >
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
            created at {{ post.creation_date.split("T")[0] }}
          </p>
          <p class="post__content">{{ post.content }}</p>
        </div>
      </div>
    </section>
    <section class="post-list" v-else>Nie znaleziono żądanych postów</section>

    <Footer />
  </div>
</template>

<script>
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import SearchField from "../components/SearchField.vue";
import BASE_LINK from "../httpConfig.js";
export default {
  name: "RegisterPage",
  components: {
    Topbar,
    Footer,
    SearchField,
  },
  data() {
    return {
      posts: [],
      filteredPosts: [],
      isSortAscending: true,
      isSortDescending: false,
    };
  },
  methods: {
    getPath(path) {
      return path.replace("localhost", "localhost");
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
    setAsc() {
      this.isSortAscending = true;
      this.isSortDescending = false;
    },
    setDesc() {
      this.isSortAscending = false;
      this.isSortDescending = true;
    },
  },
  created() {
    fetch(`${BASE_LINK}api/posts`, {
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
        this.filteredPosts = data.posts;
      });
  },
  watch: {
    isSortAscending: function () {
      console.log(this.isSortAscending);
      if (this.isSortAscending === "true") {
        console.log("test");
        this.posts = this.posts.sort((a, b) =>
          a.creation_date > b.creation_date ? 1 : -1
        );
        this.filteredPosts = this.filteredPosts.sort((a, b) =>
          a.creation_date > b.creation_date ? 1 : -1
        );
      } else {
        this.posts = this.posts.sort((a, b) =>
          a.creation_date < b.creation_date ? 1 : -1
        );
        this.filteredPosts = this.filteredPosts.sort((a, b) =>
          a.creation_date < b.creation_date ? 1 : -1
        );
      }
    },
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
  color: #888;
  border-bottom: 1px solid #ccc;
}
.post-list {
  margin: auto;
  margin-top: 10vh;
  @include border-shadow;
  padding: 1.5rem;
  background-color: $box-background;
  margin-bottom: 20vh;

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
}
.post {
  margin: auto;
  margin-top: 10vh;
  @include border-shadow-light;
  padding: 1.5rem;
  transition: 0.3s all ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 28vw;
  cursor: pointer;
  &__details {
    margin-bottom: 2rem;
    font-size: 0.7rem;
  }
  &__img {
    width: 20vw;
    height: 20vh;
  }
  &:hover {
    transform: scale(1.05);
  }
  @media (max-width: 500px) {
    width: 90vw;
  }
}
.right {
  margin-right: 3rem;
}
</style>
