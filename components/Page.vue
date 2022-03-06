<template>
  <div v-if="page">
    <Banners :items="page.images" />
    <Breadcrumb
      v-if="page && breadcrumb"
      :active="page.title"
      :description="page.description"
    />
    <div class="page">
      <DynamicSections v-model="page.sections" @input="save" />
    </div>
    <p v-if="page.description">{{ page.description }}</p>
    <div v-if="!showContent" class="text-center mb-5">
      <b-button v-if="page.content || (page.images && page.images.length) || (page.docs && page.docs.length)" variant="secondary" @click="showMore = !showMore">
        Saiba mais
      </b-button>
    </div>
    <div v-if="showMore || showContent" class="dynamic-content mt-4">
      <div v-html="page.content" />
      <Documents :documents="page.docs" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    slug: {
      type: String,
      default: null
    },
    showContent: {
      type: Boolean,
      default: false
    },
    breadcrumb: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: null,
      showMore: false
    }
  },
  async created() {
    this.page = await this.$axios.$get('/api/pages/' + this.slug)
    if (!this.page) {
      this.$emit('notFound')
    }
  },
  methods: {
    save() {
      this.$axios.$put('/api/pages/' + this.page._id, { sections: this.page.sections })
    }
  }
}
</script>
