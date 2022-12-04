<template>
  <!-- <section class="topbar">
    <router-link to="/">
      <div class="topbar__logo">Micro reddit</div></router-link
    >
    <nav class="topbar__nav">
      <p class="alert" v-if="isModerator">Konto moderatora</p>
      <router-link to="/home"
        ><p v-if="authenticated" class="topbar__item topbar__nickname">
          Home
        </p></router-link
      >
      <router-link to="/profile"
        ><p v-if="authenticated" class="topbar__item topbar__nickname">
          Mój profil
        </p></router-link
      >
      <router-link to="/login"
        ><p v-if="!authenticated" class="topbar__item topbar__register">
          Zaloguj sie
        </p></router-link
      >
      <p
        v-if="authenticated"
        @click="logout"
        class="topbar__item topbar__logout"
      >
        Logout
      </p>
    </nav> -->
  <nav class=" custom-nav navbar navbar-expand-lg navbar-light bg-light">
    <router-link to="/">
      <div class="topbar__logo">Micro reddit</div></router-link
    >
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <p class="alert" v-if="isModerator">Konto moderatora</p>
    <div
      class=" my-2 my-lg-0 collapse navbar-collapse"
      id="navbarSupportedContent"
    >
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link v-if="authenticated" to="/home"
            ><p class="topbar__item topbar__nickname">
              Home
            </p></router-link
          >
        </li>
        <li v-if="authenticated" class="nav-item">
          <router-link to="/profile"
            ><p class="topbar__item topbar__nickname">
              Mój profil
            </p></router-link
          >
        </li>
        <li v-if="!authenticated" class="nav-item">
          <router-link to="/login"
            ><p class="topbar__item topbar__register">
              Zaloguj sie
            </p></router-link
          >
        </li>
        <li v-if="authenticated" class="nav-item">
          <p
            v-if="authenticated"
            @click="logout"
            class="topbar__item topbar__logout"
          >
            Logout
          </p>
        </li>
      </ul>
    </div>
  </nav>
  <!-- </section> -->
</template>

<script>
import BASE_LINK from "../httpConfig.js";
export default {
  name: "Topbar",
  components: {},
  data() {
    return {
      authenticated: false,
      isModerator: false,
    };
  },
  methods: {
    async logout() {
      fetch(`${BASE_LINK}auth/logout`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      })
        .then((res) => {
          if (res.status === 401) console.log("???");
          if (res.status === 200) {
            localStorage.setItem("redditRole", "");
            this.authenticated = false;
          }
          return res.json();
        })
        .then((data) => console.log(data));
    },
  },
  created() {
    const role = localStorage.getItem("redditRole");
    if (role === "user" || role === "moderator") {
      if (role === "moderator") {
        this.isModerator = true;
      }
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.alert {
  color: red;
}
a {
  text-decoration: none;
  color: #444;
}

.custom-nav {
  margin-top: -5vh;
  margin-bottom: 5vh;
}
.topbar {
  width: 100vw;
  // background-color: white;
  margin-top: -3vh;
  margin-left: 0vw;
  height: 10vh;
  margin-top: -5vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #9a9a9a;
  @media (max-width: 1000px) {
    height: 15vh;
    margin-top: -8vh;
  }

  box-shadow: 0 8px 8px -4px rgba(0, 0, 0, 0.2);
  &__nav {
    margin: 2rem 5rem;
    display: flex;
    @media (max-width: 500px) {
      margin: 2rem 10vw;
    }
  }
  &__item {
    padding: 1rem;
    font-size: 1.1rem;
    cursor: pointer;
    opacity: 0.9;
    transition: 0.3s all ease-in-out;
    &:hover {
      opacity: 1;
      color: #7579e7;
    }
  }
  &__logo {
    margin: 2rem 5rem;
    font-size: 3rem;
    @media (max-width: 500px) {
      margin: 2rem 5vw;
      font-size: 1.5rem;
    }
  }
  @media (max-width: 500px) {
    height: 30vh;
  }
}
</style>
