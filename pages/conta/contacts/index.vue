<template>
  <div class="contacts">
    <b-breadcrumb :items="breadcrumb" />
    <div>
      <div v-if="contacts">
        <b-table v-if="contacts.length" :fields="table" :items="contacts" responsive="sm">
          <template v-slot:cell(actions)="data">
            <n-link :class="'btn btn-sm ' + (data.item.read ? 'btn-light' : 'btn-success')" :to="'/conta/contacts/' + data.item._id">
              <b-icon-eye />
            </n-link>
          </template>
        </b-table>
        <b-alert v-else show variant="dark" class="text-center">Nenhum item encontrado</b-alert>
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
      contacts: null,
      breadcrumb: [
        { text: 'Painel', to: '/conta' },
        { text: 'Contatos', active: true }
      ],
      table: [
        { key: 'name', label: 'Nome' },
        { key: 'email', label: 'Email' },
        { key: 'actions', label: '', class: 'text-right' }
      ]
    }
  },
  async created () {
    this.contacts = await this.$axios.$get('/api/contacts')
  }
}
</script>
