<template>
  <component :is="data.type" v-bind="data.attrs" @click="$emit('click')">
    {{ data.content }}
  </component>
</template>

<script>
import componentMixins from './mixins'
export default {
  name: 'DlTitle',
  mixins: [componentMixins]
}
</script>
