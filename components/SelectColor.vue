<template>
  <verte style="width: 24px;" model="hex" menu-position="center" :enable-alpha="false" :value="value" :color-history="defaultColors" @input="changeColor" />
</template>

<script>
import colors from '../assets/css/colors.sass'
export default {
  props: {
    value: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      defaultColors: Object.values(colors)
    }
  },
  methods: {
    changeColor(color) {
      this.$emit('input', color)
    },
    openSucker(isOpen) {
      if (isOpen) {
        // ... canvas be created
        // this.suckerCanvas = canvas
        // this.suckerArea = [x1, y1, x2, y2]
      } else {
        // this.suckerCanvas && this.suckerCanvas.remove
      }
    }
  }
}
</script>
