<template>
  <div>
    <b-badge pill :variant="selected === '' ? 'success' : 'primary'" class="pointer mr-1" @click="$emit('click', '')">Todas</b-badge>
    <b-badge v-for="tag in tags" :key="tag" pill :variant="selected !== tag ? 'primary' : 'success'" class="pointer mr-1" @click="$emit('click', tag)">{{ tag }}</b-badge>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => []
    },
    selected: {
      type: String,
      default: ''
    }
  }
}
</script>
<style>
.active-tag {
  background-color: #6acf26 !important;
}
</style>
