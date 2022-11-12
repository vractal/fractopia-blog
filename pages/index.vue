<template>
  <div>
    <div v-if="settings" class="home-page">
      <Banners :items="settings.site_banners" />
      <section class="content bg-light pb-5">
        <b-container fluid="lg">
          <div v-if="settings.description" class="text-center px-5 pt-3">
            <!-- <img src="~/assets/img/logo-laranja.svg" alt="Sobre"> -->
            <div class="title mt-3">
              <h4>Sobre</h4>
              <hr>
            </div>
            <h5 class="text-center text-primary">{{ settings.description }}</h5>
            <b-button to="/sobre" variant="secondary" class="mt-3 btn-home">
              Saiba mais
            </b-button>
          </div>
          <b-row class="mt-5">
            <b-col md="6" class="mb-3">
              <b-card
                img-src="~/assets/img/exposicoes.png"
                img-alt="Notícias"
                img-left
                class="bg-white"
              >
                <b-card-text>
                  <h5>Exposições</h5>
                  <div class="text-primary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </div>
                  <n-link
                    to="/biblioteca?category=Exposições"
                    class="stretched-link hidden"
                  />
                </b-card-text>
              </b-card>
            </b-col>
            <b-col>
              <b-card
                to
                img-src="~/assets/img/midiateca.png"
                img-alt="Acervo"
                img-left
                class="bg-white"
              >
                <b-card-text>
                  <h5>Midiateca</h5>
                  <div class="text-primary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </div>
                  <n-link to="/biblioteca" class="stretched-link hidden" />
                </b-card-text>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </section>
      <div class="page">
        <dl-layout v-model="sections" :can-edit="canEdit" :default-colors="['#f25530', '#a25661']" :start-editing="!!$route.query.edit" @save="save" />
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
    if (this.settings.home_sections) {
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
