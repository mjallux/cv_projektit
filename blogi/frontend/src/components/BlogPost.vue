<template>
  <div>
    <div class="flex flex-row justify-between">
      <h1 class="text-2xl flex-1" :class="post.slug">{{ post.title }}</h1>
      <div class="flex flex-row">
        <svg
          @click="edit()"
          v-if="!editing && user.admin && !post.new && !post.empty"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          class="w-4 h-4 place-self-center m-2 cursor-pointer"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <svg
          @click="remove()"
          v-if="editing && user.admin && !post.new"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          class="w-4 h-4 place-self-center m-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <svg
          @click="cancel()"
          v-if="(editing && user.admin) || (post.new && user.admin)"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          class="w-4 h-4 place-self-center m-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <svg
          @click="save($event)"
          v-if="editing && user.admin && post.new"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          class="w-4 h-4 place-self-center m-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <svg
          @click="update($event)"
          v-if="editing && user.admin && !post.new"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          class="w-4 h-4 place-self-center m-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>
    <p class="text-xs">
      {{ new Date(post.publishAt).toString().split("GMT")[0] }}
    </p>
    <div class="mt-4 text-left" :class="post.slug" v-html="post.body">
    </div>
    <p v-if="!post.new" class="text-xs mt-5 underline">
      {{ post.comments.length }} comments
    </p>
  </div>
</template>

<script>
import tinymce from "tinymce";
import { ref, onMounted, watch } from "vue";

tinymce.baseURL = "../../node_modules/tinymce";

export default {
  name: "BlogPost",
  emits: ["update", "cancel", "save", "remove"],
  props: {
    post: Object,
    user: Object,
  },
  setup(props, { emit }) {
    let editing = ref(false);

    onMounted(() => {
      if (props.post.new) edit();
    });

    function edit() {
      editing.value = true;
      tinymce.init({
        selector: "." + props.post.slug,
        inline: true,
        menubar: false,
        toolbar: "bold italic underline | formatselect | link image | save",
      });
    }
    function save() {
      let editorData = getEditorData();

      props.post.title = editorData.title;
      props.post.body = editorData.body;

      emit("save", props.post);
      closeEditor();
    }

    function update() {
      let editorData = getEditorData();

      props.post.title = editorData.title;
      props.post.body = editorData.body;

      emit("update", props.post);
      closeEditor();
    }

    function remove() {
      emit("remove", props.post);

      closeEditor();
    }

    function cancel() {
      emit("cancel", props.post);

      closeEditor();
    }

    function getEditorData() {
      let [title, body] = Array.from(
        document.getElementsByClassName(props.post.slug)
      ).map((element) => {
        return tinymce.get(element.id).getContent();
      });

      return { title, body };
    }

    function closeEditor() {
      editing.value = false;
      if (props.post.new) {
        delete props.post["new"];
      }
      Array.from(document.getElementsByClassName(props.post.slug)).forEach(
        (element) => {
          tinymce.get(element.id).destroy();
        }
      );
    }

    return {
      editing,
      edit,
      save,
      remove,
      cancel,
      update,
      post: props.post
    };
  },
};
</script>