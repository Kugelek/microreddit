<template>
  <div>
    <Topbar />
    <section class="user-profile">
      <h2>Edytuj swój profil</h2>
      <label>
        Email
        <input
          v-model="email"
          class="user-profile__email"
          type="mail"
          disabled
        />
      </label>
      <label>
        Nowe hasło
        <input
          v-model="password"
          class="user-profile__password"
          type="password"
        />
        <button class="button-primary" @click="confirmPassChange">EDIT</button>
        <div v-if="confirmPass" class="confirm">
          <label>
            Obecne hasło
            <input
              v-model="currPass1"
              class="user-profile__password--small"
              type="password"
            />
          </label>
          <button class="button-primary" @click="submitPassChange">
            Submit
          </button>
          <button
            class="button-primary button-secondary"
            @click="abortPassChange"
          >
            Abort
          </button>
          <h2 class="response">{{ passResponse }}</h2>
        </div>
      </label>
      <label>
        Nowy nick
        <input v-model="nickname" class="user-profile__nick" type="text" />
        <button class="button-primary" @click="confirmNickChange">EDIT</button>
        <div v-if="confirmNick" class="confirm">
          <label>
            Obecne hasło
            <input
              v-model="currPass2"
              class="user-profile__password--small"
              type="password"
            />
          </label>
          <button class="button-primary" @click="submitNickChange">
            Submit
          </button>
          <button
            class="button-primary button-secondary"
            @click="abortNickChange"
          >
            Abort
          </button>
          <h2 class="response">{{ nickResponse }}</h2>
        </div>
      </label>
    </section>
    <Footer />
  </div>
</template>

<script>
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import BASE_LINK from "../httpConfig.js";
export default {
  name: "user-profilePage",
  components: {
    Topbar,
    Footer,
  },
  data() {
    return {
      email: "",
      password: "",
      nickname: "",
      confirmPass: false,
      confirmNick: false,
      currPass1: "",
      currPass2: "",
      passResponse: "",
      nickResponse: "",
      reload: false,
    };
  },
  created() {
    fetch(`${BASE_LINK}api/users/profile`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.email = data.email;
        this.nickname = data.nickname;
      });
  },
  methods: {
    confirmPassChange() {
      this.confirmPass = !this.confirmPass;
    },
    submitPassChange() {
      console.log(this.password);
      console.log(this.currPass1);
      fetch(`${BASE_LINK}api/users/profile/password`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          password: this.password,
          oldPassword: this.currPass1,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            this.reload = true;
          }
          return res.json();
        })
        .then((data) => {
          this.passResponse = data;
        });
    },
    abortPassChange() {
      this.confirmPass = false;
    },
    confirmNickChange() {
      this.confirmNick = !this.confirmNick;
    },
    submitNickChange() {
      fetch(`${BASE_LINK}api/users/profile/nickname`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          nickname: this.nickname,
          oldPassword: this.currPass2,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            this.reload = true;
          }
          return res.json();
        })
        .then((data) => {
          this.nickResponse = data;
        });
    },
    abortNickChange() {
      this.confirmNick = false;
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
.user-profile {
  margin: auto;
  margin-top: 10vh;

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
    margin-bottom: 30vh;
  }

  & > * {
    margin: 2rem;
    width: 30vw;
  }
  & label {
    @media (max-width: 500px) {
      margin-left: -20vw;
      // width: 98vw;
      // margin-bottom: 30vh;
    }
  }

  &__login {
  }
  &__password {
  }
  .confirm {
    width: 10rem;
    margin: auto;
    margin-top: 2rem;
    margin-bottom: 3rem;
  }
}
</style>
