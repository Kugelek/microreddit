<template>
  <div class="search-container">
    <h3 v-if="option">Szukaj {{ option }}</h3>
    <h3 v-else>Szukaj posty</h3>

    <!-- <h3 v-else>Szukaj postyxdd</h3> -->
    <label>
      Po nazwie
      <input
        v-model="filteredField"
        name="filter"
        id="name"
        value="name"
        type="radio"
    /></label>
    <label>
      Po treści
      <input
        v-model="filteredField"
        name="filter"
        id="descr"
        value="description"
        type="radio"
    /></label>
    <input v-model="inputVal" class="search" />

    <button class="search-confirm button-primary" @click="search">
      Search
    </button>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    option: String,
  },
  data() {
    return {
      inputVal: "",
      filteredField: "name",
    };
  },
  methods: {
    search() {
      this.$emit("search", this.inputVal, this.filteredField);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../sharedStyles/ButtonPrimary.modules.scss";
@import "../sharedStyles/StyledInput.modules.scss";
.search-container {
  margin: 5rem;
  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    & > * {
      margin: 1rem;
    }
    input {
      width: 35vw;
    }
  }
}
.search-confirm {
  margin-left: 1rem;
}
</style>
