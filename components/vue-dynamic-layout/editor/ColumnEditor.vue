<template>
  <div>
    <div>
      <div>
        <b-tabs class="column-tabs">
          <b-tab title="Componentes" active>
            <div class="">
              <div class="p-2">
                <draggable v-model="form.components" tag="div" @end="changed">
                  <div v-for="(component, componentIndex) in form.components" :key="'component-' + componentIndex" class=" mb-1">
                    <b-btn
                      size="sm"
                      block
                      :variant="active.component === componentIndex ? 'primary' : 'outline-primary'"

                      class="text-left d-flex justify-content-between rounded-0"
                      @click="setComponent(componentIndex)"
                    >
                      <span>
                        {{ component.category ? componentCategories[component.category].title : 'Novo componente' }}
                      </span>
                      <span>
                        <b-icon-chevron-up
                          v-if="active.component === componentIndex"
                        />
                        <b-icon-chevron-down v-else />
                      </span>
                    </b-btn>
                    <div
                      v-if="active.component === componentIndex"
                    >
                      <dl-component-editor
                        v-model="form.components[active.component]"
                        :title="'Componente ' + (active.component + 1)"
                        @input="changed"
                        @close="setComponent(null)"
                        @remove="removeComponent"
                      />
                    </div>
                  </div>
                </draggable>
                <b-btn
                  class="mt-1"
                  size="sm"
                  variant="primary"
                  @click="addComponent"
                >
                  <b-icon-plus /> Adicionar componente
                </b-btn>
              </div>
            </div>
          </b-tab>
          <b-tab title="Configurações">
            <div class="px-3 py-3 dl-form">
              <div>
                <b-form-group
                  label="Tamanho da coluna"
                  :description="
                    form.attrs.lg ? parseInt((form.attrs.lg * 100) / 12) + '%' : ''
                  "
                >
                  <b-form-input
                    v-model="form.attrs.lg"
                    type="range"
                    min="1"
                    max="12"
                    step="1"
                    @input="changed"
                  />
                </b-form-group>
                <b-form-group label="Cor de fundo">
                  <SelectColor v-model="form.attrs['background-color']" />
                </b-form-group>
              </div>
              <div>
                <b-btn
                  variant="default"
                  size="sm"
                  class="mb-3"
                  @click="advancedMode = !advancedMode"
                >
                  Opções avançadas
                </b-btn>
              </div>
              <div v-if="advancedMode">
                <b-form-group label="Classes de estilo">
                  <b-form-input v-model="form.attrs.class" @input="changed" />
                </b-form-group>
              </div>
              <div class="text-right">
                <b-btn variant="danger" size="sm" @click="$emit('remove')">
                  <b-icon-trash />
                </b-btn>
              </div>
            </div>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import colors from '../../../assets/css/colors.sass'
import DlComponentEditor from './ComponentEditor.vue'
import componentCategories from './data/component-categories.json'
export default {
  name: 'DlColumnEditor',
  components: {
    draggable,
    DlComponentEditor
  },
  inject: ['active', 'setActive'],
  props: {
    value: {
      type: Object,
      default: () => null
    },
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      colors,
      componentCategories,
      form: {
        attrs: {
          lg: 12,
          'background-color': colors.white,
          class: ''
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
      this.setComponent(this.form.components.length - 1)
    },
    removeComponent() {
      this.form.components = this.form.components.filter(
        (component, i) => i !== this.active.component
      )
      this.setComponent(null)
      this.changed()
    },
    changed() {
      this.$emit('input', this.form)
    },
    close() {
      this.$emit('close')
    },
    setComponent(index) {
      if (this.active.component === index) {
        this.setActive({
          section: this.active.section,
          column: this.active.column,
          component: null
        })
      } else {
        this.setActive({
          section: this.active.section,
          column: this.active.column,
          component: index
        })
      }
    }
  }
}
</script>
<style scoped>
.column-editor {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>
