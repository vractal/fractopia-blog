<template>
  <div>
    <div>
      <div>
        <div>
          <div

            class="mb-3"
          >
            <draggable v-model="form.components" tag="div" @end="changed">
              <template v-for="(component, componentIndex) in form.components">
                <b-btn
                  :key="'component-' + componentIndex"
                  block
                  variant="primary"
                  class="text-left d-flex justify-content-between mb-1"
                  @click="setComponent(componentIndex)"
                >
                  <span>
                    <small><b-icon-grip-horizontal /></small>
                    {{ componentCategories[component.category].title }}
                  </span>
                  <span>
                    <b-icon-chevron-down v-if="active.component === componentIndex" />
                    <b-icon-chevron-right v-else />
                  </span>
                </b-btn>
                <div v-if="active.component === componentIndex" :key="'component-editor-' + componentIndex" class="pl-3">
                  <dl-component-editor
                    v-model="form.components[active.component]"
                    :title="'Componente ' + (active.component + 1)"
                    @input="changed"
                    @close="setComponent(null)"
                    @remove="removeComponent"
                  />
                </div>
              </template>
            </draggable>
          </div>
          <b-btn block class="mb-3 text-left d-flex justify-content-between" @click="addComponent">
            <span>
              Adicionar componente
            </span>
            <b-icon-plus />
          </b-btn>
        </div>
        <div class="px-3 py-3 dl-form">
          <div>
            <b-form-group label="Tamanho da coluna" :description="form.attrs.lg ? parseInt((form.attrs.lg * 100) / 12 ) + '%' : ''">
              <b-form-input v-model="form.attrs.lg" type="range" min="1" max="12" step="1" @input="changed" />
            </b-form-group>
            <b-form-group label="Cor de fundo">
              <dl-background-editor
                v-model="form.background"
                @input="changed"
              />
            </b-form-group>
          </div>
          <div class="text-right">
            <b-btn
              variant="default"
              size="sm"
              class="mb-4"
              @click="advancedMode = !advancedMode"
            >
              Opções avançadas
              <b-icon-chevron-down v-if="advancedMode" />
              <b-icon-chevron-right v-else />
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
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import DlBackgroundEditor from './component/Background.vue'
import DlComponentEditor from './ComponentEditor.vue'
import componentCategories from './data/component-categories'
export default {
  name: 'DlColumnEditor',
  components: {
    draggable,
    DlBackgroundEditor,
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
      componentCategories,
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
      this.setComponent(this.form.components.length - 1)
    },
    removeComponent() {
      this.form.components = this.form.components.filter((component, i) => i !== this.active.component)
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
