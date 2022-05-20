<template>
  <div>
    <b-form-group label="Modelo de página">
      <div v-if="selected">
        <p>Modelo escolhido:</p>
        <dl-layout :value="templates[current].value" />
        <b-btn v-b-modal.select-template-modal variant="success">
          <b-icon-pencil class="mr-1" />
          Escolher outro modelo
        </b-btn>
      </div>
      <div v-else>
        <p>Quer escolher um modelo para começar?</p>
        <b-btn v-b-modal.select-template-modal variant="success">
          <b-icon-grid-fill class="mr-1" />
          Escolher modelo de página
        </b-btn>
      </div>
    </b-form-group>
    <b-modal id="select-template-modal" title="Selecione um modelo de página" hide-footer size="xl">
      <div>
        <div class="text-center">
          <h1 class="mb-3">{{ templates[current].text }}</h1>
          <div class="d-flex justify-content-between">
            <b-btn :disabled="current == 0" variant="primary" @click="current--">
              <b-icon-chevron-left class="mr-1" />
              Modelo anterior
            </b-btn>
            <b-btn variant="success" size="lg" @click="select(current)">
              <b-icon-check-all class="mr-1" />
              Selecionar este modelo
            </b-btn>
            <b-btn :disabled="current == templates.length - 1" variant="primary" @click="current++">
              Próximo modelo
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
import DlSections from './vue-dynamic-layout/Sections.vue'
import templates from '@/data/templates'
export default {
  components: {
    DlSections
  },
  data() {
    return {
      templates,
      selected: null,
      current: 0
    }
  },
  methods: {
    select (index) {
      this.selected = templates[index]
      this.$emit('input', this.selected.value)
      this.$bvModal.hide('select-template-modal')
    }
  }
}
</script>
