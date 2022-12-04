<template>
  <div>
    <div>test</div>
    <input v-model="postcontent" type="text" />
    <button @click="addPost">Dodaj</button>
    <!-- <div>{{ postsFetchedSockets }}</div> -->
    <div :key="post.content" v-for="post in postsFetchedSockets">
      <div @click="deletePost">{{ post }}</div>
    </div>
  </div>
</template>

<script>
import io from "@/socket.connector.js";
export default {
  name: "Form",
  data() {
    return {
      postcontent: "",
      postsFetchedSockets: ["test"],
    };
  },
  methods: {
    async addPost() {
      console.log("poszlo");
      const res = await fetch("http://localhost:5000/todo", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          content: this.postcontent,
          isDone: false,
        }),
      });
      const data = await res.json();
      console.log(data);
      // this.posts = this.posts.concat(data);
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
