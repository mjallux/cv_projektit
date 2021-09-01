<template>
  <div
    class="flex flex-row mx-14 md:mx-24 my-8 justify-center md:justify-evenly"
  >
    <div
      v-if="api.user.admin"
      @click="newPost()"
      class="my-2 p-1 h-38 cursor-pointer rounded-full hover:bg-pink-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
        class="w-5 h-5 mb-1"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="text-vertical font-light noselect">New post</p>
    </div>
    <div>
      <div v-if="posts.length" class="flex flex-col pb-4 min-w-1/3">
        <blog-post
          v-for="post in posts"
          :post="post"
          :user="api.user"
          :key="post.slug"
          class="border-b-1 border-white"
          @update="updatePost($event)"
          @save="createPost($event)"
          @cancel="cancelPost($event)"
          @remove="removePost($event)"
        />
        <p class="underline mt-6">Load more...</p>
      </div>
      <h1 v-else>No posts found...</h1>
    </div>
    <div class="hidden md:block">
      <h1>Mar 2021 &lt;</h1>
      <h2 class="text-indent-xs">Monday 8</h2>
      <h2 class="text-indent-xs">Saturday 25</h2>
      <h1>Feb 2021 &gt;</h1>
      <h1>Jan 2021 &gt;</h1>
      <h1>Dec 2020 &gt;</h1>
    </div>
  </div>
</template>

<script>
import BlogPost from "./BlogPost.vue";
import { ref, inject } from "vue";
import { Driver } from "../lib/ApiDriver.js";
import { postSkeleton } from "../lib/Utils";

export default {
  name: "Blog",
  components: {
    BlogPost,
  },
  setup() {
    let api = inject('api').value

    let posts = ref([]);
    updatePosts();

    function newPost() {
      let newPost = postSkeleton();
      newPost.new = true;
      if (typeof posts.value[0] === "undefined") {
        posts.value = [newPost];
      } else if (Object.keys(posts.value[0]).indexOf("new") < 0) {
        posts.value.unshift(newPost);
      }
    }

    function updatePosts() {
      api.fetchPosts().then((val) => (posts.value = val));
    }

    function cancelPost(event) {
      if (event.new) posts.value.splice(posts.value.indexOf(event), 1);
    }

    function updatePost(event) {
      if (!event.new) {
        api.updatePost(event);
      }
    }

    function removePost(event) {
      api
        .removePost(event)
        .then(posts.value.splice(posts.value.indexOf(event), 1));
    }

    function createPost(event) {
      if (event.new) {
        api.createPost(event);
      }
    }

    return {
      posts,
      newPost,
      updatePosts,
      updatePost,
      createPost,
      cancelPost,
      removePost,
      api,
    };
  },
};
</script>