<template>
  <div class="orders">
    <b-breadcrumb :items="breadcrumb" />
    <div>
      <div v-if="orders">
        <table v-if="orders.length" class="table b-table b-table-stacked-sm">
          <thead>
            <tr>
              <th>Código</th>
              <th>Data do pedido</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order._id">
              <td><b-btn size="sm" :class="order.status" :to="'/conta/pedidos/' + order._id"><strong>#{{ order.code }}</strong> <small>({{ optionText(order.status, 'order-status') }})</small></b-btn></td>
              <td>{{ $moment(order.createdAt).format("DD/MM/YYYY") }}</td>
              <td>{{ order.items.reduce((a, b) => a + b.total, 0) | moeda }}</td>
            </tr>
          </tbody>
        </table>
        <b-alert v-else show variant="dark" class="text-center">Nenhum item encontrado</b-alert>
      </div>
      <div v-else class="text-center">
        <b-spinner small label="Carregando..." />
      </div>
    </div>
  </div>
</template>
<script>
import { optionText } from '@/utils'
import features from '@/data/features'
export default {
  layout: 'conta',
  data () {
    return {
      optionText,
      orders: null,
      table: [
        { key: 'image', label: '' },
        { key: 'title', label: 'Título' },
        { key: 'category', label: 'Categoria' },
        { key: 'tags', label: 'Tags' },
        { key: 'publishing_date', label: 'Publicação' },
        { key: 'actions', label: '', class: 'text-right' }
      ]
    }
  },
  computed: {
    settings() {
      return this.$store.state.settings
    },
    breadcrumb() {
      let title = features.shop.title
      if (this.settings && this.settings.features && this.settings.features.shop && this.settings.features.shop.title) {
        title = this.settings.features.shop.title
      }
      let breadcrumb = [
        { text: 'Painel', to: '/conta' },
        { text: title, to: '/conta/shop' },
        { text: 'Pedidos', active: true }
      ]

      if (this.$auth.user.role === 'user') {
        breadcrumb = [
          { text: 'Minha conta', to: '/conta' },
          { text: title, to: '/loja' },
          { text: 'Meus pedidos', active: true }
        ]
      }
      return breadcrumb
    }
  },
  created () {
    this.list()
  },
  methods: {
    async list () {
      this.orders = await this.$axios.$get('/api/orders')
    },
    remove (order) {
      this.$bvModal.msgBoxConfirm('Tem certeza que deseja excluír este item?').then(async confirmed => {
        if (confirmed) {
          await this.$axios.delete('/api/orders/' + order._id).then(() => {
            this.list()
            this.$toast.success('Item removido com sucesso!')
          })
        }
      })
    }
  }

}
</script>
