<template>
  <div class="dashboard">
    <b-breadcrumb :items="breadcrumb" />
    <n-link v-if="unreadContacts > 0" to="/conta/contacts">
      <b-alert show variant="danger" class="text-center">{{ unreadContacts == 1 ? '1 Mensagem não lida' : unreadContacts +' Mensagens não lidas' }}</b-alert>
    </n-link>

    <b-list-group v-if="$auth.user.role === 'admin' || $auth.user.role === 'super'">
      <b-list-group-item to="/conta/pages">Páginas</b-list-group-item>
      <b-list-group-item to="/conta/menus">Menus</b-list-group-item>
      <template v-for="key in Object.keys(settings.features)">
        <b-list-group-item v-if="settings.features[key].enabled" :key="key" :to="'/conta/' + key">{{ settings.features[key].title }}</b-list-group-item>
      </template>
      <b-list-group-item to="/conta/contacts">Contatos</b-list-group-item>
      <b-list-group-item to="/conta/users">Usuários</b-list-group-item>
      <b-list-group-item to="/conta/settings">Configurações</b-list-group-item>
    </b-list-group>
    <b-list-group v-else>
      <b-list-group-item to="/conta/pedidos">Meus pedidos</b-list-group-item>
      <b-list-group-item to="/conta/profile">Meus dados</b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  layout: 'conta',
  data () {
    return {
      unreadContacts: 0,
      breadcrumb: [
        { text: this.$auth.user.role === 'user' ? 'Minha conta' : 'Painel', active: true }
      ]
    }
  },
  computed: {
    settings() {
      return this.$store.state.settings
    }
  },
  async created () {
    this.unreadContacts = await this.$axios.$get('/api/contacts/unread')
  }
}
</script>
