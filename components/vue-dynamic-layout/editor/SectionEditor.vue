<template>
  <div>
    <div>
      <div>
        <b-tabs class="section-tabs">
          <b-tab lazy title="Colunas" active>
            <div class="">
              <div class="p-2">
                <draggable v-model="form.columns" tag="div" class="d-inline-block" @end="changed">
                  <div v-for="(column, columnIndex) in form.columns" :key="'column-' + columnIndex" class="d-inline-block">
                    <b-btn

                      :variant="active.column === columnIndex ? 'primary' : 'outline-primary'"
                      class="text-left d-flex justify-content-between mb-1 mr-1"
                      size="sm"
                      @click="setColumn(columnIndex)"
                    >
                      <span>
                        <!-- <small><b-icon-arrows-move /></small> -->
                        Coluna {{ columnIndex + 1 }}
                      </span>
                    </b-btn>
                  </div>
                </draggable>
                <b-btn variant="primary" size="sm" @click="addColumn">
                  <b-icon-plus />
                </b-btn>
              </div>

              <div v-if="active.column != null" class="pt-1">
                <dl-column-editor
                  v-model="form.columns[active.column]"
                  :title="'Coluna ' + (active.column + 1)"
                  @input="changed"
                  @close="setColumn(null)"
                  @remove="removeColumn"
                  @duplicate="duplicateColumn"
                />
              </div>
            </div>
          </b-tab>
          <b-tab lazy title="Configuração">
            <div class="px-3 py-3 dl-form">
              <div>
                <b-form-group label="O conteúdo deve ocupar toda a largura da tela?">
                  <b-form-checkbox v-model="form.attrs.fluid" switch class="d-inline-block" @input="changed" />
                  {{ form.attrs.fluid ? "Sim" : "Não" }}
                </b-form-group>
                <b-form-group label="Cor de fundo">
                  <SelectColor v-model="form.attrs['background-color']" />
                </b-form-group>
                <b-form-group v-if="form.attrs['background-color']" label="A cor de fundo deve ocupar toda a largura da tela?">
                  <b-form-checkbox v-model="form.attrs['background-fluid']" switch class="d-inline-block" @input="changed" />
                  {{ form.attrs['background-fluid'] ? "Sim" : "Não" }}
                </b-form-group>
              </div>
              <div class="text-right">
                <b-btn
                  variant="default"
                  size="sm"
                  class="mb-3"
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
                <b-btn variant="info" size="sm" @click="$emit('duplicate')">
                  Duplicar
                </b-btn>
                <b-btn variant="danger" size="sm" @click="$emit('remove')">
                  Remover
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
import DlColumnEditor from './ColumnEditor.vue'
export default {
  name: 'DlSectionEditor',
  components: {
    draggable,
    DlColumnEditor
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
      form: {
        attrs: {
          fluid: false,
          'background-color': colors.white,
          'background-fluid': false,
          class: ''
        },
        columns: []
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
    addColumn() {
      this.form.columns.push({
        attrs: {
          lg: 12,
          'background-color': colors.white,
          class: ''
        },
        components: []
      })
      this.setColumn(this.form.columns.length - 1)
      this.changed()
    },
    removeColumn() {
      const active = this.active.column
      this.setColumn(null)
      this.form.columns = this.form.columns.filter((column, i) => i !== active)
      this.changed()
    },
    duplicateColumn() {
      const active = this.active.column
      this.form.columns.splice(active, 0, JSON.parse(JSON.stringify(this.form.columns[active])))
      this.changed()
    },
    changed() {
      this.$emit('input', this.form)
    },
    close() {
      this.$emit('close')
    },
    setColumn(index) {
      // console.log();
      if (this.active.column === index) {
        this.setActive({
          section: this.active.section,
          column: null
        })
      } else {
        this.setActive({
          section: this.active.section,
          column: index
        })
      }
    }

  }
}
</script>
