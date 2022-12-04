<template>
  <div>
    <Topbar />
    <h1>Subreddity</h1>
    <p>
      <a
        v-if="auth"
        class="btn btn-primary"
        data-toggle="collapse"
        href="#collapseExample"
        role="button"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        Add new post
      </a>
      <!-- <button
        class="btn btn-primary"
        type="button"
        data-toggle="collapse"
        data-target="#collapseExample"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        Button with data-target
      </button> -->
    </p>
    <div class="collapse" id="collapseExample">
      <section v-if="auth" class="add-subreddit">
        <h1 class="add-subreddit__heading">Add new subreddit</h1>
        <label class="label-name">
          <span>Subreddit name</span>
          <input v-model="name" class="add-subreddit__name" type="text" />
        </label>
        <label class="label-content">
          <span>Subreddit description</span>
          <textarea v-model="description" class="add-subreddit__content" />
        </label>
        <button @click="addSubreddit" class="btn-submit button-primary">
          Nowy subreddit
        </button>
        {{ info }}
      </section>
    </div>
    <!-- <section v-if="auth" class="add-subreddit">
      <h1 class="add-subreddit__heading">Add new subreddit</h1>
      <label class="label-name">
        <span>Subreddit name</span>
        <input v-model="name" class="add-subreddit__name" type="text" />
      </label>
      <label class="label-content">
        <span>Subreddit description</span>
        <textarea v-model="description" class="add-subreddit__content" />
      </label>
      <button @click="addSubreddit" class="btn-submit button-primary">
        Nowy subreddit
      </button>
      {{ info }}
    </section> -->
    <SearchField @search="search" :option="option" />
    <section class="reddit-list">
      <div
        class="single-reddit"
        :key="subred.id"
        v-for="subred in filteredSubreddits"
      >
        <div>
          <label>Subredit name</label>
          <input
            v-if="editedId === subred.id"
            v-model="editedName"
            type="text"
          />
          <div v-else class="single-reddit__name">{{ subred.name }}</div>
        </div>

        <div v-if="subred.moderated" class="single-reddit__moderators">
          <label>Additional info</label>
          You're moderator of this subreddit
        </div>

        <div>
          <label>Content</label>
          <input
            v-if="editedId === subred.id"
            v-model="editedDescription"
            type="text"
          />
          <div v-else class="single-reddit__content">
            {{ subred.description }}
          </div>
        </div>
        <router-link
          :to="{
            name: 'SubredditPage',
            params: {
              subredId: subred.name || 1,
            },
          }"
          ><button class="button-primary">Show posts</button></router-link
        >
        <button
          @click="setEditedId(subred.id)"
          v-if="subred.moderated || amIModerator"
          class="button-primary button-secondary btn-small"
          :disabled="editedId === subred.id"
        >
          Edit
        </button>
        <div v-if="editedId === subred.id">
          <button class="btn btn-success" @click="submitEdit">
            Submit edit
          </button>
          <button class="btn btn-danger" @click="abortEdit">Abort edit</button>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script>
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import SearchField from "../components/SearchField.vue";
import BASE_LINK from "../httpConfig.js";
export default {
  name: "SubredditsWall",
  components: {
    Topbar,
    Footer,
    SearchField,
  },
  data() {
    return {
      name: "",
      description: "",
      subreddits: [],
      filteredSubreddits: [],
      showForm: false,
      auth: false,
      info: "",
      editedId: -1,
      editedName: "",
      editedDescription: "",
      option: "subreddity",
      editInfo: "",
      amIModerator: false,
    };
  },
  methods: {
    search(val, type) {
      if (val) {
        console.log(type);
        if (type === "name")
          this.filteredSubreddits = this.subreddits.filter((subr) =>
            subr.name.includes(val)
          );
        if (type === "description")
          this.filteredSubreddits = this.subreddits.filter((subr) =>
            subr.description.includes(val)
          );
      } else {
        this.filteredSubreddits = this.subreddits;
      }
    },
    abortEdit() {
      this.editedId = -1;
    },
    async submitEdit() {
      //send edited stuff...
      console.log({
        id: this.editedId,
        name: this.editedName,
        description: this.editedDescription,
      });

      fetch(`${BASE_LINK}api/subreddits/${this.editedId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: this.editedName,
          description: this.editedDescription,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          if (!data.id) {
            alert(data);
          } else {
            alert("Pomyślnie edytowano, nastąpi odświeżenie");
            setTimeout(() => {
              window.location.reload();
            }, 300);
          }
        });

      this.editedId = -1;
    },
    setEditedId(id) {
      this.editedId = id;
    },
    toggleShowForm() {
      this.showForm = !this.showForm;
    },
    async addSubreddit() {
      fetch(`${BASE_LINK}api/subreddits`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: this.name,
          description: this.description,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          if (!data.id) {
            this.info = data;
          } else {
            this.info = "udało się dodać subreddit, jesteś jego moderatorem";
            this.subreddits.push(data);
          }
        });
    },
  },
  created() {
    this.amIModerator =
      localStorage.getItem("redditRole") === "moderator" ? true : false;
    const role = localStorage.getItem("redditRole");
    if (role === "user" || role === "moderator") {
      this.auth = true;
    } else {
      this.auth = false;
    }
    fetch(`${BASE_LINK}api/subreddits`, {
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
        console.log(data);
        //przygotuj dane
        this.moderated = [...data.moderated];
        this.subreddits = [...data.subreddits];

        this.subreddits.forEach((subr) => {
          this.moderated.forEach((moderated) => {
            if (subr.id === moderated.subreddit_id) subr.moderated = true;
          });
        });
        this.filteredSubreddits = [...this.subreddits];
        console.log(this.subreddits);
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../sharedStyles/ButtonPrimary.modules.scss";
@import "../sharedStyles/StyledInput.modules.scss";
@import "../sharedStyles/ShadowBorderMixin.modules.scss";

.btn-small {
  width: 9vw !important;
  @media (max-width: 500px) {
    width: 30vw !important;
  }
}
.single-reddit {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  -webkit-box-shadow: 2px 4px 7px 4px rgba(0, 0, 0, 0.18);
  box-shadow: 2px 4px 7px 4px rgba(0, 0, 0, 0.18);
  width: 90%;
  margin: 1rem 4rem;
  & > * {
    // margin-left: -10rem;
    display: flex;
    margin-left: 1rem;
    margin-top: 1rem;
    // justify-content: flex-sta;
  }
}
label {
  font-size: 0.8rem;
  color: #666;
  margin-right: 2rem;
  // margin-top: 1rem;
}
.add-subreddit {
  margin: auto;
  margin-top: 10vh;

  background-color: $box-background;
  border: 1px solid #888;
  border-radius: 5px;
  padding: 1.5rem;
  -webkit-box-shadow: 2px 4px 7px 4px rgba(0, 0, 0, 0.18);
  box-shadow: 2px 4px 7px 4px rgba(0, 0, 0, 0.18);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 35vw;
  & > * {
    padding: 1rem;
  }

  @media (max-width: 1000px) {
    width: 70vw;
    margin-left: 4.5vw;
  }
  @media (max-width: 500px) {
    width: 98vw;
  }

  &__name {
    width: 15vw;
  }
  &__content {
    width: 30vw;
    height: 15vh;
  }
}
.label-content {
  display: flex;
  flex-direction: column;
  & > * {
    padding: 0.5rem;
  }
  span {
    margin: 0.5rem;
  }
}
.label-name {
  display: flex;
  flex-direction: column;
  & > * {
    padding: 0.5rem;
  }
}

.reddit-list {
  margin: auto;
  margin-top: 10vh;
  margin-bottom: 30vh;
  border: 1px solid #ccc;
  background-color: $box-background;
  border-radius: 5px;
  padding: 1.5rem;
  -webkit-box-shadow: 2px 4px 7px 4px rgba(0, 0, 0, 0.18);
  box-shadow: 2px 4px 7px 4px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 35vw;
  & > * {
    padding: 1rem;
  }

  @media (max-width: 1000px) {
    width: 70vw;
    margin-left: 4.5vw;
  }
  @media (max-width: 500px) {
    width: 98vw;
  }
}
</style>
