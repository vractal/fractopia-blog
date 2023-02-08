<template>
  <div>
    <div v-if="documents && documents.length > 0" class="documents mt-3 mb-3">
      <!-- <h5 class="mb-3">{{ label }}</h5> -->
      <b-btn v-for="doc in documents" :key="doc._id" :href="doc.url" target="_blank" class="mr-1 mb-1 text-left" variant="primary" @click="trackDownload(doc)">
        <div class="mb-1">
          <small><b-icon-paperclip /> Baixar documento </small>
        </div>
        {{ doc.title || doc.url }}
      </b-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    documents: {
      type: Array,
      default: () => []
    },
    label: {
      type: String,
      default: 'Documentos'
    }
  },
  methods: {
    trackDownload(doc) {
      this.$gtag.event('action', {
        event_category: 'Biblioteca',
        event_label: 'Baixar documento',
        value: doc.title
      })
    }
  }
}
</script>
