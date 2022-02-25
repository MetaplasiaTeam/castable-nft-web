<template>
  <a v-bind:href="url">{{ text }}</a>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    url: String,
    text: String,
  },
});
</script>

<style scoped>
a {
  text-decoration: none;
}

a {
  display: inline-block;
  margin-top: 2.4rem;
  margin-right: 0.2rem;
  padding: 0.3rem 0.8rem;
  background: var(--color-decoration);
  border-radius: 4px;
  font-size: 1.1rem;
  color: var(--color-text-lighter);
  transition: all 0.3s ease;
}

a:hover {
  background: var(--color-text);
  color: var(--color-background);
}
</style>
