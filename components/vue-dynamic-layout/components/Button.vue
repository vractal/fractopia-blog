<template>
  <component :is="data.type" v-bind="data.attrs" :variant="data.attrs.outlined ? 'outline-' + data.attrs.variant : data.attrs.variant" :target="data.attrs.href && data.attrs.href.startsWith('http') ? '_blank' : null" @click="$emit('click')">
    {{ data.content }}
  </component>
</template>

<script>
import componentMixins from './mixins'
export default {
  name: 'DlButton',
  mixins: [componentMixins]
}
</script>
