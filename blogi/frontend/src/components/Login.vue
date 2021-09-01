<template class="flex items-center justify-center flex-row ">
  <div class="flex-1 flex items-center justify-center flex-col bg-aurora">
    <form class="flex flex-col ring-2 ring-white p-5 bg-black" @submit.prevent="login()">
      <h1 class="self-center m-3 text-2xl">Login</h1>
      <p class="self-left my-2">Username</p>
      <input v-model="username" type="text" placholder="Username" />

      <p class="my-2">Password</p>
      <input v-model="password" type="password" />

      <input
        class="text-white bg-black ring-1 ring-white py-1 px-3 mt-5"
        type="submit"
        value="Login"
      />
    </form>
  </div>
</template>

<script>
import { Driver } from "../lib/ApiDriver.js";
import { router } from "../router.js";
import { ref } from "vue";

export default {
  name: "login",
  emits: ['login'],
  setup(props, { emit }) {
    let username = ref();
    let password = ref();

    function login() {
      const api = new Driver(username.value, password.value)
      api.user.then(() => {
          if(api.user.admin) {
              emit('login', api)
              window.sessionStorage.setItem('user', JSON.stringify(api.user))
              router.push({name: 'Home'})
          }
      })
    }

    return {
      login,
      username,
      password,
    };
  }
};
</script>