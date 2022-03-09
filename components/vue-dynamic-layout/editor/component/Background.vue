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
    <b-btn
      size="sm"
      style="border: 1px solid #f0f0f0; font-size: 10px;"
      variant="outline-primary"
      @click="setVariant(null)"
    >
      Transparente
    </b-btn>
    <b-form-input
      type="color"
      style="width: 30px; height: 25px; border: 1px solid #505050; outline: 0; padding: 0; margin: 0; margin-top: 3px; border-radius: 3px;"
      class="d-inline"
      @input="setVariant"
    />
  </div>
</template>
<script>
export default {
  name: 'DlBackgroundEditor',
  inject: ['defaultColors'],
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
