<template>
  <component :is="data.type" v-bind="data.attrs" :style="style" @click="$emit('click')">
    {{ data.content }}
  </component>
</template>

<script>
import componentMixins from './mixins'
export default {
  name: 'DlTitle',
  mixins: [componentMixins],
  computed: {
    style() {
      const attrs = this.data.attrs
      const styles = []
      if (attrs.color) {
        styles.push('color: ' + attrs.color + ' !important')
      }
      if (attrs.align) {
        styles.push('text-align: ' + attrs.align + ' !important')
      }
      return styles.join('; ')
    }
  }
}
</script>
