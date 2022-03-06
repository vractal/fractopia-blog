<template>
  <div>
    <div :class="{'edit-page': editMode}" class="mb-5 pt-3">
      <template v-for="(component, index) in components">
        <template v-if="component.type">
          <DynamicBanners v-if="component.type === 'dynamic-banners'" :key="'dynamic-banners' + index" class="dynamic-component" :class="{'active-component': editComponent === index}" :attrs="{ id: 'dynamic-component-' + index, ...component.attrs }" @click="editComponent = index" />
          <DynamicCard v-else-if="component.type === 'dynamic-card'" :key="'dynamic-card' + index" class="dynamic-component" :class="{'active-component': editComponent === index}" :attrs="{ id: 'dynamic-component-' + index, ...component.attrs }" @click="editComponent = index" />
          <DynamicComponent v-else :id="'dynamic-component-' + index" :key="'dynamic-component' + index" class="dynamic-component" :class="{'active-component': editComponent === index}" :type="component.type" :attrs="component.attrs" @click="editComponent = index" v-html="component.content" />
        </template>
        <b-tooltip v-if="editMode" :key="'component-tooltip-' + index" :target="'dynamic-component-' + index" triggers="hover" variant="primary">
          <b-btn variant="primary" @click="editComponent = index">Editar este elemento</b-btn>
        </b-tooltip>
      </template>
    </div>
    <div v-if="editMode">
      <div class="text-center mb-3">
        <b-btn @click="addComponent">Adicionar elemento</b-btn>
      </div>
      <DynamicComponentForm v-if="editComponent !== null" v-model="components[editComponent]" @close="closeComponent" @save="save" @remove="removeComponent" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      editComponent: null,
      components: []
    }
  },
  computed: {
    editMode() {
      return this.$auth.user && (this.$auth.user.role === 'admin' || this.$auth.user.role === 'super')
    }
  },
  created() {
    if (this.value && this.value.length) {
      this.components = this.value
    }
  },
  methods: {
    save() {
      this.$emit('input', this.components)
    },
    closeComponent(save) {
      this.editComponent = null
      if (save) {
        this.save()
      }
    },
    addComponent(component) {
      this.components.push({
        type: null,
        attrs: {
          class: ''
        },
        content: null,
        category: null
      })
      this.editComponent = this.components.length - 1
    },
    removeComponent() {
      const components = this.components
      delete components[this.editComponent]
      this.components = [...components].filter(component => component)
      this.editComponent = null
      this.save()
    }
  }
}
</script>
