<template>
  <ValidationObserver v-slot="{ validate, invalid }">
    <b-form @submit.prevent="validate().then(save)">
      <b-form-group label="Título do site">
        <validation-provider v-slot="{ errors }" name="título do site" rules="required">
          <b-form-input v-model="form.title" name="title" />
          <span class="text-danger">{{ errors[0] }}</span>
        </validation-provider>
      </b-form-group>
      <b-row>
        <b-col md="6">
          <b-form-group label="Nome do administrador">
            <validation-provider v-slot="{ errors }" name="nome do administrador" rules="required">
              <b-form-input v-model="form.admin_name" />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Email do administrador">
            <validation-provider v-slot="{ errors }" name="email do administrador" rules="required">
              <b-form-input v-model="form.email" name="email" />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6">
          <b-form-group label="Senha do administrador">
            <validation-provider v-slot="{ errors }" name="senha" rules="required|min:6">
              <b-form-input v-model="form.password" type="password" name="pass" />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="Confirmar senha">
            <validation-provider v-slot="{ errors }" name="confirmar senha" rules="required">
              <b-form-input v-model="form.password_confirmation" type="password" name="pass_confirmation" />
              <span class="text-danger">{{ errors[0] }}</span>
              <span v-if="form.password_confirmation && form.password_confirmation !== form.password" class="text-danger">As senhas digitadas não conferem</span>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
      <b-button type="submit" variant="success" block :disabled="invalid">
        Salvar
      </b-button>
    </b-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'

import mixinForm from '@/mixins/form'

export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  mixins: [mixinForm],
  props: {
    settings: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      form: {
        title: '',
        admin_name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  created () {
    this.toForm(this.form, this.settings)
  },
  methods: {
    async save () {
      const settings = await this.$axios.$post('/api/settings/setup', this.form)
      if (settings) {
        await this.$auth.loginWith('local', { data: this.form })
        this.$toast.success('Configurações cadastradas com sucesso!')
        this.$router.push('/conta/settings')
      }
    }
  }
}
</script>
