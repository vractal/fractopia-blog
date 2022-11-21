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
        </p>
        <p>
          <strong>
            <b-icon-envelope />
            {{ contact.email }}
          </strong>
        </p>
        <p>
          <strong>
            <b-icon-calendar />
            {{ $moment(contact.createdAt).format("DD/MM/YYYY HH:mm") }}
          </strong>
        </p>
        <p>
          {{ contact.message }}
        </p>
        <b-btn variant="danger" size="sm" @click="remove">
          <b-icon-trash /> Remover mensagem
        </b-btn>
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
  },
  methods: {
    remove () {
      this.$bvModal.msgBoxConfirm('Tem certeza que deseja excluír esta mensagem?').then(async confirmed => {
        if (confirmed) {
          await this.$axios.delete('/api/contacts/' + this.$route.params.id).then(() => {
            this.$toast.success('Mensagem removida com sucesso!')
            this.$router.push('/conta/contacts')
          })
        }
      })
    }
  }
}
</script>
