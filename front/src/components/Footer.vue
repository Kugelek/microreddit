<template>
  <footer class="footer">
    <div>Copyrights Jakub Pobłocki</div>
  </footer>
</template>

<script>
export default {
  name: "Topbar",
  components: {},
  data() {
    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.footer {
  width: 100vw;

  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #efefef;
  height: 6vh;

  border-top: 1px solid #9a9a9a;

  & > * {
  }
}
</style>
