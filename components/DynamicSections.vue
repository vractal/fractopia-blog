<template>
  <div>
    <div>
      <template v-for="(section, index) in sections">
        <b-container
          :id="'dynamic-section-' + index"
          :key="'section-' + index"
          v-bind="{...section.attrs, ...backgroundAttrs(section.background)}"
        >
          <b-row>
            <b-col
              v-for="(col, colIndex) in section.cols"
              :key="'col-' + colIndex"
              v-bind="{...col.attrs, ...backgroundAttrs(col.background)}"
            >
              <DynamicComponents v-model="col.components" @input="save" />
            </b-col>
          </b-row>
        </b-container>
        <b-tooltip
          v-if="editMode"
          :key="'section-tooltip-' + index"
          :target="'dynamic-section-' + index"
          triggers="hover"
          variant="primary"
        >
          <b-btn variant="primary" @click="editSection = index">
            Editar esta sessão
          </b-btn>
        </b-tooltip>
      </template>
    </div>
    <div v-if="editMode">
      <div class="text-center mb-3 pt-3">
        <b-btn @click="addSection">Adicionar seção</b-btn>
      </div>
      <DynamicSectionForm
        v-if="editSection !== null"
        v-model="sections[editSection]"
        @close="closeSection"
        @save="save"
        @remove="removeSection"
      />
    </div>
    <b-container>
      <pre>{{ sections }}</pre>
    </b-container>
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
  data() {
    return {
      editSection: null,
      sections: []
    }
  },
  computed: {
    editMode() {
      return (
        this.$auth.user &&
        (this.$auth.user.role === 'admin' || this.$auth.user.role === 'super')
      )
    }
  },
  created() {
    if (this.value && this.value.length) {
      this.sections = this.value
    }
  },
  methods: {
    save() {
      this.$emit('input', this.sections)
    },
    closeSection(save) {
      this.editSection = null
      if (save) {
        this.save()
      }
    },
    addSection(section) {
      this.sections.push({
        background: null,
        attrs: {
          fluid: false
        },
        cols: []
      })
      this.editSection = this.sections.length - 1
    },
    removeSection() {
      const sections = this.sections
      delete sections[this.editSection]
      this.sections = [...sections].filter(section => section)
      this.editSection = null
      this.save()
    },
    backgroundAttrs(background) {
      const attrs = {}
      if (background) {
        if (background.startsWith('#')) {
          attrs.style = {}
          attrs.style['background-color'] = background
        } else {
          attrs.class = {}
          attrs.class['bg-' + background] = true
        }
      }
      return attrs
    }
  }
}
</script>
