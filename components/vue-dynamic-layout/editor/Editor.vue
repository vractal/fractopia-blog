<template>
  <div
    :show="showEditor"
    class="vue-dynamic-layout-editor"
  >
    <div>
      <div class="mb-3 d-flex align-items-center justify-content-between">
        <div>
          <strong>Editor de conteúdo</strong>
        </div>
        <div class="d-flex">
          <b-btn v-if="hasChanged" class="mr-1" variant="success" block title="Você tem alterações não salvas" @click="save()">
            <b-icon-check /> Salvar
          </b-btn>
          <b-btn variant="primary" icon @click="$emit('close')">
            <b-icon-x />
          </b-btn>
        </div>
      </div>
      <b-alert :show="savedAlert" variant="success" outlined>
        <b-icon-check-circle-fill class="mr-2" /> Alterações salvas!
      </b-alert>
      <div class="mb-3">
        <div class="mb-3">
          <div v-if="sections.length === 0">
            <SelectTemplate @input="loadTemplate" />
          </div>
          <draggable v-model="sections" tag="div" :disabled="active.section != null" @end="changed">
            <div v-for="(section, i) in sections" :key="'section-' + i" class="pb-2">
              <b-btn

                block
                :variant="active.section === i ? 'primary' : 'outline-primary'"
                class="text-left d-flex justify-content-between rounded-0"
                @click="setSection(i)"
              >
                <span>
                  Seção {{ i + 1 }}
                </span>
                <span>
                  <b-icon-chevron-up v-if="active.section === i" />
                  <b-icon-chevron-down v-else />
                </span>
              </b-btn>
              <div v-if="active.section === i" style="background-color: #fff;">
                <dl-section-editor
                  v-model="sections[active.section]"
                  :title="'Seção ' + (active.section + 1)"
                  @input="changed"
                  @remove="removeSection"
                  @duplicate="duplicateSection"
                  @close="setSection(null)"
                />
              </div>
            </div>
          </draggable>
          <div v-if="active.section == null" class="info-box">
            <small><b-icon-exclamation-circle /> Clique e arraste na seção para reordenar</small>
          </div>
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
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import colors from '../../../assets/css/colors.sass'
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
      this.$emit('input', this.sections.filter(s => s))
      this.hasChanged = true
    },
    addSection(section) {
      this.sections.push({
        attrs: {
          fluid: false,
          'background-color': colors.white,
          'background-fluid': false,
          class: ''
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
    duplicateSection() {
      const active = this.active.section
      this.sections.splice(active, 0, JSON.parse(JSON.stringify(this.sections[active])))
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
