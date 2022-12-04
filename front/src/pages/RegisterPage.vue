<template>
  <div>
    <Topbar />
    <section class="register">
      <h2>Zarejestruj się!</h2>
      <label>
        Email
        <input v-model="email" class="register__email" type="mail" />
      </label>
      <label>
        Hasło
        <input v-model="password" class="register__password" type="password" />
      </label>
      <label>
        Powtórz hasło
        <input
          v-model="repeatPassword"
          class="register__password"
          type="password"
        />
      </label>
      <label>
        Nick
        <input v-model="nickname" class="register__nick" type="text" />
      </label>
      <button class="btn-submit button-primary" @click="register">
        Zarejestruj się
      </button>
      <h2 class="response">{{ response }}</h2>
      <router-link to="/login"> <p>Masz już konto? Zaloguj się</p></router-link>
    </section>
    <Footer />
  </div>
</template>

<script>
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import BASE_LINK from "../httpConfig.js";
export default {
  name: "RegisterPage",
  components: {
    Topbar,
    Footer,
  },
  data() {
    return {
      email: "",
      nickname: "",
      password: "",
      repeatPassword: "",
      response: "",
      registered: false,
    };
  },
  methods: {
    async register() {
      const formData = {
        email: this.email,
        nickname: this.nickname,
        password: this.password,
        repeatPassword: this.repeatPassword,
      };
      console.log(formData);

      fetch(`${BASE_LINK}auth/register`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          nickname: this.nickname,
          password: this.password,
          repeatPassword: this.repeatPassword,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            this.$router.push("/login");
            this.registered = true;
          }
          return res.json();
        })
        .then((data) => (this.response = data));
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
.btn-submit {
  width: 7rem !important;
  cursor: pointer;
}
.register {
  margin: auto;
  margin-top: 10vh;
  margin-bottom: 25vh;
  border: 1px solid #888;
  border-radius: 5px;
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
    width: 98vw;
    align-items: flex-start;
  }

  & > * {
    margin: 2rem;
    width: 30vw;
  }
  & input {
    @media (max-width: 500px) {
      margin-left: -7vw;
    }
  }

  &__login {
  }
  &__password {
  }
}
</style>
