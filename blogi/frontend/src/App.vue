<template>
<div class="flex flex-col min-h-screen">
    <app-header />
    <router-view @login="setDriver($event)"  />
    <app-footer />
</div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

import { Driver } from './lib/ApiDriver.js'
import { provide, ref } from 'vue'

export default {
  name: 'app',
  components: {
      AppHeader, AppFooter
  },
  setup() {
      let api = ref(new Driver())
      if(window.sessionStorage.getItem('user')) {
          api.value.user = JSON.parse(window.sessionStorage.getItem('user'))
      }
      provide('api', api)

      function setDriver(event) {
          api.value = event
      }
      return {
          setDriver
      }
  }
}
</script>

<style>
body {
  @apply bg-black;
}
</style>