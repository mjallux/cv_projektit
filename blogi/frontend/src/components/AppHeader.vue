<template>
  <nav class="flex items-center w-full justify-between flex-col md:flex-row">
    <h1 class="font-mono p-5 tracking-widest text-2xl text-white  align-text-bottom">
      Final<span class="text-xs align-top">frontier</span>
    </h1>
    <div class="flex flex-row tracking-widest divide-x-1">
      <router-link to="/"><h1 class="px-5 my-2">Home</h1></router-link>
      <h1 class="px-5 my-2">About</h1>
      <h1 class="px-5 my-2">Blog</h1>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'AppHeader',
  setup() {

  }
}
</script>