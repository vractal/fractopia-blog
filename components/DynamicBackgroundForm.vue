<template>
  <div>
    <b-btn
      v-for="variant in variants"
      :key="variant"
      size="sm"
      :variant="variant"
      style="border: 1px solid #f0f0f0; font-size: 10px;"
      @click="setVariant(variant)"
    >
      <b-icon-check-circle v-if="background === variant" />
      <b-icon-check v-else :variant="variant" />
    </b-btn>
    <b-form-input
      type="color"
      style="width: 40px;"
      class="d-inline"
      @input="setVariant"
    />
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: () => {}
    }
  },
  data() {
    return {
      background: null,
      variants: [
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
        'info',
        'light',
        'dark'
      ]
    }
  },
  created() {
    if (this.value && this.value) {
      this.background = this.value
    }
  },
  methods: {
    setVariant(variant) {
      this.background = variant
      this.save()
    },
    save() {
      this.$emit('input', this.background)
    }
  }
}
</script>
