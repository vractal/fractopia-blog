<template>
  <div>
    <div v-if="form">
      <b-sidebar
        :visible="true"
        title="Editar seção"
        right
        shadow
        @hidden="close"
      >
        <div class="px-3 py-3">
          <div>
            <div>
              <div>
                <b-form-group label="Esta sessão ocupa a linha toda?">
                  <b-form-checkbox v-model="form.attrs.fluid" class="d-inline-block" @input="save" />
                  {{ form.attrs.fluid ? "Sim" : "Não" }}
                </b-form-group>
                <b-form-group label="Cor de fundo">
                  <DynamicBackgroundForm
                    v-model="form.background"
                    @input="save"
                  />
                </b-form-group>
              </div>
              <div class="mb-3">
                <h5 v-if="form.cols.length > 0">Colunas:</h5>
                <div
                  v-for="(col, colIndex) in form.cols"
                  :key="'col-' + colIndex"
                >
                  <b-btn
                    block
                    variant="primary"
                    class="text-left d-flex justify-content-between column-btn"
                    @click="toggleCol(colIndex)"
                  >
                    <span>
                      <strong>{{ colIndex + 1 }}ª</strong> coluna
                    </span>
                    <span>
                      <b-icon-chevron-up v-if="colIndex === editCol" />
                      <b-icon-chevron-down v-else />
                    </span>
                  </b-btn>
                  <DynamicColumnForm
                    v-if="editCol === colIndex"
                    v-model="form.cols[colIndex]"
                    @input="changed = true"
                  />
                </div>
                <b-btn block class="mt-3" @click="addColumn">
                  <b-icon-plus /> Adicionar coluna
                </b-btn>
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
                  <b-form-input v-model="form.attrs.class" @input="save" />
                </b-form-group>
              </div>
              <div v-if="changed" class="pt-2 mb-4">
                <b-btn size="lg" variant="primary" block @click="close()">
                  Concluir
                </b-btn>
              </div>
              <div class="text-right">
                <b-btn variant="danger" @click="$emit('remove')">Remover</b-btn>
              </div>
            </div>
          </div>
        </div>
      </b-sidebar>
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
          fluid: false
        },
        cols: []
      },
      editCol: null,
      changed: false,
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
      this.form.cols.push({
        background: null,
        attrs: {
          lg: '12'
        },
        components: []
      })
      this.changed = true
    },
    save() {
      this.$emit('input', this.form)
      this.changed = true
      this.editCol = null
    },
    close() {
      this.$emit('close', this.changed)
    },
    toggleCol(index) {
      if (this.editCol === index) {
        this.editCol = null
      } else {
        this.editCol = index
      }
    }
  }
}
</script>
<style scoped>
.column-btn {
  border-radius: 0;
  border-bottom: 2px;
}
</style>
