<template>
  <div>
    <div v-if="settings" class="home-page">
      <Banners :items="settings.site_banners" />
      <div class="page">
        <dl-layout v-model="sections" :can-edit="canEdit" :start-editing="!!$route.query.edit" @save="save" />
      </div>
    </div>
  </div>
</template>
<script>
import DlLayout from '../components/vue-dynamic-layout/Layout.vue'
export default {
  components: {
    DlLayout
  },
  data () {
    return {
      sections: []
    }
  },
  computed: {
    settings() {
      return this.$store.state.settings
    },
    canEdit() {
      return (
        this.$auth.user &&
        (this.$auth.user.role === 'admin' || this.$auth.user.role === 'super')
      )
    }
  },
  created() {
    if (this.settings && this.settings.home_sections) {
      this.sections = JSON.parse(JSON.stringify(this.settings.home_sections))
    }
  },
  methods: {
    async save () {
      await this.$axios.$post('/api/settings', { home_sections: this.sections })
    }
  }
}
</script>
