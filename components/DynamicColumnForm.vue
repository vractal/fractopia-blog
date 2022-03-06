<template>
  <div class="bg-white py-3 px-2 column-form">
    <b-form-group label="Tamanho da coluna" description="Uma linha pode ser dividida em até 12 colunas">
      <b-form-input v-model="form.attrs.lg" type="number" min="1" max="12" @input="save" />
    </b-form-group>
    <b-form-group label="Cor de fundo">
      <DynamicBackgroundForm
        v-model="form.background"
        @input="save"
      />
    </b-form-group>
    <div class="text-right">
      <b-btn variant="danger" size="sm" @click="$emit('remove')">
        <b-icon-trash />
      </b-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      form: {
        background: null,
        attrs: {
          lg: 12
        },
        components: []
      },
      advancedMode: false
    }
  },
  watch: {
    value() {
      this.form = { ...this.value }
    }
  },
  created() {
    this.form = { ...this.value }
  },
  methods: {
    addComponent() {
      this.form.components.push({
        type: null,
        attrs: {
          class: ''
        },
        content: null,
        category: null
      })
      this.editComponent = this.form.components.length - 1
    },
    removeComponent() {
      const components = this.form.components
      delete components[this.editComponent]
      this.form.components = [...components].filter(component => component)
      this.editComponent = null
      this.save()
    },
    save() {
      this.$emit('input', this.form)
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style scoped>
.column-form {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>
