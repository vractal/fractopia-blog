<template>
  <div>
    <div v-if="documents && documents.length > 0" class="documents mt-4">
      <!-- <h5 class="mb-3">{{ label }}</h5> -->
      <b-btn v-for="doc in documents" :key="doc._id" :href="doc.url" target="_blank" class="mr-1 mb-1" size="sm">
        <b-icon-paperclip /> {{ doc.title || 'Baixar arquivo' }}
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
  }
}
</script>
