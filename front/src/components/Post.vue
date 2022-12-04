<template>
  <div>
    <input v-if="isEditable" type="text" name="edit" v-model="content" />
    <button v-if="isEditable" @click="handleSubmit()">submit edit</button>
    <div v-else class="hello" @click="$emit('deletePost', id)">
      {{ content }} {{ id }} {{ isDone }}
    </div>
    <input
      type="checkbox"
      id="scales"
      name="scales"
      v-model="isDone"
      @change="$emit('changeState', { id: id, value: isDone })"
    />
    <button @click="handleEditState">EDIT</button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    content: String,
    id: Number,
    isDone: Boolean,
  },
  data() {
    return {
      isEditable: false,
    };
  },
  methods: {
    handleEditState() {
      this.isEditable = !this.isEditable;
    },
    handleSubmit() {
      this.isEditable = false;
      this.$emit("updatePost", { id: this.id, value: this.content });
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
