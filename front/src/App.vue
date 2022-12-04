<template>
  <!-- <Wall /> -->

  <router-view />
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body {
  background: rgb(154, 179, 245);
  background: linear-gradient(
    143deg,
    rgba(154, 179, 245, 0.4) 0%,
    rgba(238, 238, 238, 0.8) 44%,
    rgba(154, 179, 245, 0.6) 99%
  );
}
</style>
