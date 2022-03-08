<template>
  <div :id="attrs.id" @click="$emit('click')">
    <Banners v-bind="attrs" />
  </div>
</template>

<script>
export default {
  name: 'DlBanners',
  props: {
    attrs: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
