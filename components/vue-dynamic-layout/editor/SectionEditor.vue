<template>
  <div>
    <div>
      <div v-if="active.column !== null">
        <dl-column-editor
          v-model="form.columns[active.column]"
          :title="'Coluna ' + (active.column + 1)"
          @input="changed"
          @close="setColumn(null)"
          @remove="removeColumn"
        />
      </div>
      <div v-else>
        <div class="mb-3">
          <b-btn variant="primary" size="sm" class="mr-2" @click="close">
            <b-icon-chevron-left />
          </b-btn>
          <strong>
            {{ title }}
          </strong>
        </div>
        <div class="mb-3">
          <draggable v-model="form.columns" tag="div" @end="changed">
            <b-btn
              v-for="(column, columnIndex) in form.columns"
              :key="'column-' + columnIndex"
              block
              variant="primary"
              class="text-left d-flex justify-content-between mb-1"
              @click="setColumn(columnIndex)"
            >
              <span>
                <small><b-icon-grip-horizontal /></small>
                Coluna {{ columnIndex + 1 }}
              </span>
              <span>
                <b-icon-chevron-right />
              </span>
            </b-btn>
          </draggable>
          <b-btn block class="mt-3 text-left d-flex justify-content-between" @click="addColumn">
            <span>
              Adicionar coluna
            </span>
            <b-icon-plus />
          </b-btn>
        </div>
        <div class="px-3 py-3 dl-form">
          <div>
            <b-form-group label="Esta sessão ocupa a linha toda?">
              <b-form-checkbox v-model="form.attrs.fluid" class="d-inline-block" @input="changed" />
              {{ form.attrs.fluid ? "Sim" : "Não" }}
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
import DlColumnEditor from './ColumnEditor.vue'
import DlBackgroundEditor from './component/Background.vue'
export default {
  name: 'DlSectionEditor',
  components: {
    draggable,
    DlColumnEditor,
    DlBackgroundEditor
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
      form: {
        background: null,
        attrs: {
          fluid: false
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
        background: null,
        attrs: {
          lg: '12'
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
    changed() {
      this.$emit('input', this.form)
    },
    close() {
      this.$emit('close')
    },
    setColumn(index) {
      this.setActive({
        section: this.active.section,
        column: index
      })
    }

  }
}
</script>
