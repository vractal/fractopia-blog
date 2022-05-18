<template>
  <div v-if="page">
    <Banners :items="page.images" />
    <Breadcrumb
      v-if="page && breadcrumb"
      :active="page.title"
      :description="page.description"
    />
    <div class="page">
      <dl-layout v-model="sections" :can-edit="canEdit" :default-colors="['#f25530', '#a25661']" :start-editing="$route.query.edit" @save="save" />
    </div>
    <Documents :documents="page.docs" />
  </div>
</template>
<script>
import variables from '../assets/css/variables.sass'
import DlLayout from './vue-dynamic-layout/Layout.vue'
export default {
  components: {
    DlLayout
  },
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
      variables,
      page: null,
      showMore: false,
      sections: []
    }
  },
  computed: {
    canEdit() {
      return (
        this.$auth.user &&
        (this.$auth.user.role === 'admin' || this.$auth.user.role === 'super')
      )
    }
  },
  async created() {
    this.page = await this.$axios.$get('/api/pages/' + this.slug)
    if (this.page) {
      this.sections = this.page.sections
    } else {
      this.$emit('notFound')
    }
  },
  methods: {
    save() {
      this.$axios.$put('/api/pages/' + this.page._id, { sections: this.sections })
    }
  }
}
</script>
