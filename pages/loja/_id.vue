<template>
  <div>
    <Breadcrumb
      v-if="product"
      :links="[[title, '/loja']]"
      :active="product.name"
      :description="product.description"
    />
    <b-container class="shop py-4">
      <div v-if="product">
        <div class="text-md-right">
          <CartButton />
        </div>
        <br>
        <div class="row">
          <div v-if="product.images && product.images.length" class="col-sm-5">
            <b-carousel id="carousel-fade" v-model="slide" style="text-shadow: 0 0 2px #000;" fade indicators img-width="1024" img-height="480" class="mb-3">
              <b-carousel-slide v-for="(image, index) in product.images" :key="index" :img-src="image.url" />
            </b-carousel>
            <div v-if="product.images.length > 1" class="product_thumbs row">
              <div v-for="(image, index) in product.images" :key="index" class="col-sm-3">
                <a @click="setSlide(index)"><img class="thumbnail" :src="image.url" :class="{active: (slide === index)}"></a>
              </div>
            </div>
          </div>
          <div class="col-md-7 col-sm-7">
            <h1 class="title"> {{ product.name }} </h1>
            <tags :tags="product.tags" @click="(tag) => $router.push('/loja?tag=' + tag)" />
            <br>
            <AddToCart :product="product" />
            <br>
            <p v-if="product.description" class="pre-line">{{ product.description }}</p>
            <div v-if="product.content" v-html="product.content" />
          </div>
          <div v-if="related_products.length" class="div mt-4 text-primary">
            <div class="card-header">
              <strong>Produtos relacionados</strong>
            </div>
            <div class="card-body">
              <b-card-group columns>
                <Product v-for="related_product in related_products" :key="related_product._id" :product="related_product" />
              </b-card-group>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <b-spinner />
      </div>
    </b-container>
  </div>
</template>

<script>
import features from '@/data/features'
export default {
  data() {
    return {
      product: null,
      slide: 0,
      qtd: 1,
      related_products: []
    }
  },
  computed: {
    alreadyOnCart() {
      let qtd = 0
      const cart = this.$store.state.cart
      if (cart && cart.length) {
        qtd = cart.filter(i => i.product._id === this.product._id).reduce((a, b) => {
          return a + b.qtd
        }, 0)
      }
      return qtd
    },
    availableQtd() {
      let qtd = 0
      if (this.product) {
        qtd = this.product.qtd - this.alreadyOnCart
      }
      return qtd
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
  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        this.get()
      }
    }
  },

  created() {
    this.get()
    this.getRelated()
  },
  methods: {
    async get() {
      this.product = await this.$axios
        .$get('/api/shop/product/' + this.$route.params.id)
    },
    async getRelated() {
      this.related_products = await this.$axios.$get('/api/shop/related/' + this.$route.params.id)
    },
    setSlide(slide) {
      this.slide = slide
    }
  }
}
</script>
