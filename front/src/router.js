import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

import SubredditsWall from "@/pages/SubredditsWall.vue";
import LoginPage from "@/pages/LoginPage.vue";
import RegisterPage from "@/pages/RegisterPage.vue";
import UserProfilePage from "@/pages/UserProfilePage.vue";
import SingleSubredditPage from "@/pages/SingleSubredditPage.vue";
import SinglePostPage from "@/pages/SinglePostPage.vue";
import Home from "@/pages/Home.vue";

const routes = [
  {
    path: "/",
    name: "SubredditsWall",
    component: SubredditsWall,
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "RegisterPage",
    component: RegisterPage,
  },
  {
    path: "/profile",
    name: "UserProfilePage",
    component: UserProfilePage,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/posty/:postId",
    name: "SinglePostPage",
    component: SinglePostPage,
  },
  {
    path: "/subreddit/:subredId",
    name: "SubredditPage",
    component: SingleSubredditPage,
  },
  // {
  //   path: "/subreddit/:subredId",
  //   name: "SubredditPage",
  //   component: SingleSubredditPage,
  //   children: [
  //     {
  //       // UserProfile will be rendered inside User's <router-view>
  //       // when /user/:id/profile is matched
  //       path: "post/:postId",
  //       name: "SinglePostPage",
  //       component: SinglePostPage,
  //     },
  //   ],
  // },
];

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes,
});

export default router;
