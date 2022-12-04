<template>
  <div>
    <!-- <Form @addPost="addPost" /> -->
    <h1>lista xD</h1>
    <div class="test"><p class="test__parag">XDDD</p></div>
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
import Form from "./Form.vue";
export default {
  name: "HelloWorld",
  components: {
    Post,
    Form,
  },
  data() {
    return {
      posts: [],
    };
  },
  methods: {
    async addPost(post) {
      console.log("poszlo");
      const res = await fetch("http://localhost:5000/todo", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          content: post,
          isDone: false,
        }),
      });

      const data = await res.json();
      console.log(data);
      this.posts = this.posts.concat(data);
    },

    async changeState({ id, value }) {
      const res = await fetch(`http://localhost:5000/todo/${id}/state`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          isDone: value,
        }),
      });
      await res.json();
    },
    async updatePost({ id, value }) {
      const res = await fetch(`http://localhost:5000/todo/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          content: value,
        }),
      });
      await res.json();
    },
    async deletePost(id) {
      console.log("del");
      const res = await fetch(`http://localhost:5000/todo/${id}`, {
        method: "DELETE",
      });
      res.status === 200
        ? (this.posts = this.posts.filter((post) => post.id !== id))
        : alert("Cant delete");
    },

    async fetchPosts() {
      const posts = await fetch("http://localhost:5000/todo");
      console.log(posts);
      return await posts.json();
    },
  },
  mounted() {
    io.on("postAdded", (e) => {
      console.log(e);
      this.posts.push(e);
    });
  },
  async created() {
    this.posts = await this.fetchPosts();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.test {
  background-color: green;
  width: 5rem;
  height: 5rem;
  &__parag {
    color: red;
  }
}
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
