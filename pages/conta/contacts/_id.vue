<template>
  <div class="contact">
    <b-breadcrumb :items="breadcrumb" />
    <div>
      <div v-if="contact">
        <p>
          <strong>
            <b-icon-person-lines-fill />
            {{ contact.name }}
          </strong>
          <br>
          <strong>
            <b-icon-envelope />
            {{ contact.email }}
          </strong>
        </p>
        <p>
          {{ contact.message }}
        </p>
      </div>
      <div v-else class="text-center">
        <b-spinner small label="Carregando..." />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  layout: 'conta',

  data () {
    return {
      contact: null,
      breadcrumb: [
        { text: 'Painel', to: '/conta' },
        { text: 'Contatos', to: '/conta/contacts' },
        { text: 'Mensagem', active: true }
      ]

    }
  },
  async created () {
    this.contact = await this.$axios.$get('/api/contacts/' + this.$route.params.id)
  }
}
</script>
