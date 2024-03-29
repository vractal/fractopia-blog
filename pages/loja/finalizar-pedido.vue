<template>
  <div>
    <Breadcrumb
      :links="[[title, '/loja']]"
      active="Finalizar do pedido"
    />
    <b-container class="pt-4 pb-5">
      <div v-if="cart && cart.length">
        <h4 class="text-center">Finalize o pedido</h4>
        <p class="text-center mb-4">Confirme os dados abaixo para finalizar o pedido</p>
        <ValidationObserver v-slot="{ validate, invalid }">
          <b-form @submit.prevent="validate().then(save)">
            <b-row>
              <b-col md="6">
                <b-form-group label="Nome *">
                  <validation-provider v-slot="{ errors }" name="nome" rules="required">
                    <b-form-input v-model="form.name" name="name" />
                    <span class="text-danger">{{ errors[0] }}</span>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Organização">
                  <b-form-input v-model="form.organization" />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="CPF/CNPJ *">
                  <validation-provider v-slot="{ errors }" name="CPF/CNPJ" rules="required">
                    <b-form-input v-model="form.cpf_cnpj" v-mask="['###.###.###-##', '##.###.###/####-##']" name="cpf_cnpj" />
                    <span class="text-danger">{{ errors[0] }}</span>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Telefone de contato *">
                  <validation-provider v-slot="{ errors }" name="telefone" rules="required">
                    <b-form-input v-model="form.phone" v-validate="'required'" v-mask="['(##) ####-####', '(##) #####-####']" name="phone" placeholder="(99) 99999-9999" />
                    <span class="text-danger">{{ errors[0] }}</span>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Email *">
                  <validation-provider v-slot="{ errors }" name="email" rules="required|email">
                    <b-form-input v-model="form.email" name="email" />
                    <span class="text-danger">{{ errors[0] }}</span>
                  </validation-provider>
                </b-form-group>
              </b-col>
              <b-col md="12">
                <b-form-group label="Endereço de entrega *">
                  <AddressForm v-model="form.address" @input="setPostalCode" />
                </b-form-group>
              </b-col>
            </b-row>
            <br>
            <Cart />
            <b-button type="submit" size="lg" variant="success" block :disabled="invalid">
              FINALIZAR O PEDIDO
            </b-button>
          </b-form>
        </ValidationObserver>
      </div>
      <div v-else class="text-center my-5">
        <h4>Seu carrinho está vazio</h4>
        <b-btn to="/loja" variant="light">
          Voltar para a loja
        </b-btn>
        <b-btn to="/conta/pedidos" variant="primary">
          Ver meus pedidos
        </b-btn>
      </div>
    </b-container>
  </div>
</template>
<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import features from '@/data/features'
export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  middleware: 'auth',
  data() {
    const form = {
      name: '',
      email: '',
      address: null,
      phone: '',
      shipping: 0
    }
    return {
      form
    }
  },
  computed: {
    cart() {
      return this.$store.state.cart
    },
    total() {
      return this.$store.state.cart.reduce(function(a, item) {
        return a + (Number(item.qtd) * Number(item.product.price))
      }, 0)
    },
    settings() {
      return this.$store.state.settings
    },
    title() {
      if (this.settings && this.settings.features && this.settings.features.shop && this.settings.features.shop.title) {
        return this.settings.features.shop.title
      }
      return features.shop.title
    }

  },
  created() {
    this.setUser()
  },
  methods: {
    setUser() {
      this.form.name = this.$auth.user.name
      this.form.email = this.$auth.user.email
      this.form.organization = this.$auth.user.organization
      this.form.address = this.$auth.user.addresses[0]
      this.form.phone = this.$auth.user.phone
      this.form.cpf_cnpj = this.$auth.user.cpf_cnpj
      this.form.supplier = this.$auth.user.supplier
    },
    async save() {
      this.isSending = true
      this.form.cart = this.cart
      const order = await this.$axios.$post('/api/shop/order', this.form)
      if (order && order._id) {
        this.$toast.success('Seu pedido de compra foi realizado com o sucesso! Em breve entraremos em contato.')
        this.$store.commit('clearCart')
        this.$router.replace('/conta/pedidos/' + order._id)
      }
      this.isSending = false
    },
    setPostalCode(address) {
      if (address.postal_code) {
        this.$store.commit('setPostalCode', address.postal_code)
      }
    }
  }
}
</script>
