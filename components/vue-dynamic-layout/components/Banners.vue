<template>
  <div @click="$emit('click')">
    <Banners v-bind="data.attrs" />
  </div>
</template>

<script>
import componentMixins from './mixins'
export default {
  name: 'DlBanners',
  mixins: [componentMixins]
}
</script>
