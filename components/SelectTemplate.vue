<template>
  <div>
    <b-form-group label="Modelo de página">
      <div v-if="selected">
        <p>Modelo escolhido:</p>
        <div class="mb-3">
          <dl-sections :value="templates[current].value" />
        </div>

        <b-btn v-b-modal.select-template-modal variant="success">
          <b-icon-pencil class="mr-1" />
          Escolher outro modelo
        </b-btn>
      </div>
      <div v-else>
        <p>Quer escolher um modelo para começar?</p>
        <b-btn v-b-modal.select-template-modal variant="success">
          <b-icon-grid-fill class="mr-1" />
          Escolher modelo
        </b-btn>
      </div>
    </b-form-group>
    <b-modal id="select-template-modal" title="Selecione de um modelo ou página" hide-footer size="xl">
      <div>
        <div class="text-center">
          <div class="d-flex justify-content-between">
            <b-btn :disabled="current == 0" variant="primary" @click="current--">
              <b-icon-chevron-left class="mr-1" />
            </b-btn>
            <b-btn variant="success" size="lg" @click="select">
              <b-icon-check-all class="mr-1" />
              {{ templates[current].type === 'Página' ? 'Copiar desta página' : 'Copiar deste modelo' }}
            </b-btn>
            <b-btn :disabled="current == templates.length - 1" variant="primary" @click="current++">
              <b-icon-chevron-right class="mr-1" />
            </b-btn>
          </div>
        </div>
        <hr>
        <dl-sections :value="templates[current].value" />
      </div>
    </b-modal>
  </div>
</template>

<script>
import templates from '@/data/templates'
import DlSections from './vue-dynamic-layout/Sections.vue'
export default {
  components: {
    DlSections
  },
  data() {
    return {
      pages: null,
      selected: null,
      current: 0
    }
  },
  provide() {
    return {
      active: {
        section: null,
        column: null,
        component: null
      },
      setActive: () => null,
      defaultColors: this.defaultColors
    }
  },
  computed: {

    templates() {
      let pages = []
      if (this.pages) {
        pages = this.pages.filter(page => page.sections && page.sections.length).map(page => ({
          text: page.title,
          value: page.sections,
          type: 'Página'
        }))
      }
      return [
        ...templates,
        ...(pages)
      ]
    }
  },
  created() {
    this.loadPages()
  },
  methods: {
    async loadPages () {
      this.pages = await this.$axios.$get('/api/pages')
    },
    select() {
      this.selected = this.templates[this.current]
      this.$emit('input', this.selected.value)
      this.$bvModal.hide('select-template-modal')
    }
  }
}
</script>
