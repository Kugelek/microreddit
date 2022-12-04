<template>
  <div>
    <div>test</div>
    <router-link to="/list">Lista zadan</router-link> |
    <router-link to="/new">Dodaj kolejne</router-link>
    <div :key="post" v-for="post in posts">
      <Post
        :content="post.content"
        :id="post.id"
        :isDone="post.isdone"
        @deletePost="deletePost"
        @changeState="changeState"
        @updatePost="updatePost"
      />
    </div>
  </div>
</template>

<script>
import Post from "./Post.vue";
export default {
  name: "MainPage",
  components: { Post },
  data() {
    return {
      posts: [],
    };
  },
  methods: {
    async fetchPosts() {
      const posts = await fetch("http://localhost:5000/todo");
      console.log(posts);
      return await posts.json();
    },
  },
  async created() {
    this.posts = await this.fetchPosts();
    this.posts = this.posts.slice(0, 3);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
