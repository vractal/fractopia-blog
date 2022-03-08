<template>
  <component :is="'dl-' + category" v-bind="attrs" @click="$emit('click')" />
</template>

<script>
import DlCard from './components/Card.vue'
import DlBanners from './components/Banners.vue'
import DlTitle from './components/Title.vue'

export default {
  name: 'DlComponentRenderer',
  components: {
    DlCard,
    DlBanners,
    DlTitle
  },
  props: {
    category: {
      type: String,
      default: null,
      required: true
    },
    attrs: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
