<template>
  <b-sidebar
    :visible="showEditor"
    title="Editor de layout"
    right
    shadow
    @hidden="$emit('close')"
  >
    <div class="px-3 py-3">
      <div class="mb-3">
        <div class="mb-3">
          <div v-if="sections.length === 0">
            <SelectTemplate @input="loadTemplate" />
          </div>
          <draggable v-model="sections" tag="div" @end="changed">
            <template v-for="(section, i) in sections">
              <b-btn

                :key="'section-' + i"
                block
                variant="primary"
                class="text-left d-flex justify-content-between mb-1"
                @click="setSection(i)"
              >
                <span>
                  <small><b-icon-grip-horizontal /></small>
                  Seção {{ i + 1 }}
                </span>
                <span>
                  <b-icon-chevron-down v-if="active.section === i" />
                  <b-icon-chevron-right v-else />
                </span>
              </b-btn>
              <div v-if="active.section === i" :key="'section-editor-' + i" class="pl-3">
                <dl-section-editor
                  v-model="sections[active.section]"
                  :title="'Seção ' + (active.section + 1)"
                  @input="changed"
                  @remove="removeSection"
                  @close="setSection(null)"
                />
              </div>
            </template>
          </draggable>
          <b-btn
            block
            class="mt-3 text-left d-flex justify-content-between"
            @click="addSection"
          >
            <span>
              Adicionar seção
            </span>
            <b-icon-plus />
          </b-btn>
        </div>
      </div>
      <div v-if="hasChanged" class="mb-4">
        <p class="text-danger mb-3">
          <small>
            <b-icon-exclamation-octagon class="mr-2" />
            Você tem alterações não salvas
          </small>
        </p>
        <b-btn size="lg" variant="primary" block @click="save()">
          <b-icon-check /> Salvar alterações
        </b-btn>
      </div>
      <b-alert :show="savedAlert" variant="success">
        <b-icon-check-circle-fill class="mr-2" /> Alterações salvas!
      </b-alert>
    </div>
  </b-sidebar>
</template>

<script>
import draggable from 'vuedraggable'
import DlSectionEditor from './SectionEditor.vue'
export default {
  name: 'DlEditor',
  components: {
    draggable,
    DlSectionEditor
  },
  inject: ['active', 'setActive'],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      sections: [],
      hasChanged: false,
      savedAlert: false,
      showEditor: false
    }
  },
  watch: {
    show() {
      this.showEditor = this.show
    }
  },
  created() {
    this.showEditor = this.show
    this.sections = this.value
  },
  methods: {
    save() {
      this.$emit('save', this.sections)
      this.hasChanged = false
      this.showSavedAlert()
    },
    changed() {
      this.$emit('input', this.sections)
      this.hasChanged = true
    },
    addSection(section) {
      this.sections.push({
        background: null,
        background_fluid: null,
        attrs: {
          fluid: false
        },
        columns: []
      })
      this.setSection(this.sections.length - 1)
      this.changed()
    },
    removeSection() {
      const active = this.active.section
      this.setSection(null)
      this.sections = this.sections.filter((section, i) => i !== active)
      this.changed()
    },
    showSavedAlert() {
      this.savedAlert = true
      setTimeout(() => {
        this.savedAlert = false
      }, 1000)
    },
    setSection(index) {
      if (this.active.section === index) {
        this.setActive({ section: null })
      } else {
        this.setActive({ section: index })
      }
    },
    loadTemplate(template) {
      this.sections = template
      this.changed()
    }
  }
}
</script>
