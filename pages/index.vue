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
          </b-row>
        </b-container>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    settings () {
      return this.$store.state.settings
    }
  }
}
</script>
