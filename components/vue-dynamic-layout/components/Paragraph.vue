<template>
  <component :is="data.type" v-bind="data.attrs" class="dynamic-content" @click="$emit('click')" v-html="data.content" />
</template>

<script>
import componentMixins from './mixins'
export default {
  name: 'DlParagraph',
  mixins: [componentMixins]
}
</script>
