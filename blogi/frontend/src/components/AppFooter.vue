<template>
  <footer class="flex items-center justify-between w-full">
      <router-link v-if="!loggedIn" :to="{name: 'Login'}" class="text-xs m-5 text-gray-500">login</router-link>
      <a v-else class="text-xs m-5 text-gray-500 cursor-pointer" @click="logout()">logout</a>
    <h1 class="text-white text-sm font-mono tracking-widest m-5">Design by Aleksi</h1>
  </footer>
</template>

<script>
import { inject, toRef } from 'vue'
export default {
  name: 'AppFooter',
  setup() {
      let api = inject('api')
      let loggedIn = api.value.user.admin
      console.log(loggedIn)
      return {
        loggedIn,
        logout: () => {
            window.sessionStorage.clear()
            window.location.reload()
        }
    }
  }
}
</script>