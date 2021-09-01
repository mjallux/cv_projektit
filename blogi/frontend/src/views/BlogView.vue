<template>
<div>
    <app-body />
    <blog  /> 
</div>
</template>

<script>
import AppBody from '../components/AppBody.vue'
import Blog from '../components/Blog.vue'

export default {
    name: 'BlogView',
    components: {
        AppBody, Blog
    }
}
</script>