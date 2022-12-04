<template>
  <div>
    <Topbar />
    <section class="login">
      <h2>Zaloguj się</h2>
      <label>
        Email
        <input v-model="email" class="login__email" type="mail" />
      </label>
      <label>
        Hasło
        <input v-model="password" class="login__password" type="password" />
      </label>
      <button @click="login" class="btn-submit button-primary">
        Zaloguj sie
      </button>
      <h2 class="response">{{ response }}</h2>
      <router-link to="/register"> <p>Załóż konto już teraz!</p></router-link>
    </section>
    <Footer />
  </div>
</template>

<script>
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import BASE_LINK from "../httpConfig.js";
export default {
  name: "Register",
  components: {
    Topbar,
    Footer,
  },
  data() {
    return {
      email: "",
      password: "",
      response: "",
      succesfulLogin: false,
      authenticated: false,
    };
  },
  methods: {
    async login() {
      if (this.email === "" || this.password === "") {
        this.response = "Uzupełnij dane";
        return;
      }
      fetch(`${BASE_LINK}auth/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: this.email,
          password: this.password,
        }),
      })
        .then((res) => {
          if (res.status === 401) this.response = "Niepoprawne dane logowania";
          // if (res.status === 200) {
          //   this.$router.push("/");
          // }
          return res.json();
        })
        .then((data) => {
          if (data && data.role) {
            localStorage.setItem("redditRole", data.role);
            this.$router.push("/");
          } else {
            localStorage.setItem("redditRole", "");
          }
        });
    },
  },
  // created(){
  //   if()
  // }
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
.btn-submit {
  width: 7rem !important;
  cursor: pointer;
  @media (max-width: 500px) {
    width: 30vw !important;
    margin-left: 30vw !important;
  }
}
.login {
  margin: auto;
  margin-top: 10vh;
  margin-bottom: 20vh;
  background-color: $box-background;
  @include border-shadow;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 35vw;

  @media (max-width: 1000px) {
    width: 80vw;
  }
  @media (max-width: 500px) {
    width: 100vw;
    align-items: flex-start;
    margin-left: -1rem;
  }

  & > * {
    margin: 2rem;
    width: 30vw;
    @media (max-width: 500px) {
      width: 45vw;
      margin-left: 25vw;
    }
  }

  & input {
    @media (max-width: 500px) {
      margin-left: -15vw;
    }
  }

  &__login {
  }
  &__password {
  }
}
</style>
