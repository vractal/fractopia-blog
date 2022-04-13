<template>
  <div class="medias-page">
    <Breadcrumb
      v-if="media"
      :links="[[title, '/biblioteca']]"
      :active="media.title"
      :description="media.description ? $options.filters.truncate(media.description, 160) : null"
      :img="media.image ? baseUrl + media.image.url : null"
    />
    <Breadcrumb v-else :active="title" />
    <section id="content" class="content pt-4">
      <b-container>
        <div>
          <b-row>
            <b-col md="3" class="search">
              <b-button
                v-if="filters.search || filters.category || filters.type"
                class="mb-3"
                variant="secondary"
                block
                @click="clearFilters"
              >
                Limpar filtros
              </b-button>
              <div v-if="filterOptions">
                <div class="mb-3">
                  <b-input-group>
                    <b-form-input
                      v-model="filters.search"
                      type="search"
                      placeholder="O que você busca?"
                      @keyup.prevent.enter="filter()"
                    />
                    <b-input-group-append>
                      <b-button variant="outline-primary" @click="filter()">
                        <b-icon-search />
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </div>
                <b-form-select
                  v-model="filters.type"
                  :options="filterOptions.types"
                  class="mb-3"
                  @input="filter()"
                >
                  <template v-slot:first>
                    <b-form-select-option value="">
                      Todos os tipos
                    </b-form-select-option>
                  </template>
                </b-form-select>
                <b-card
                  v-if="
                    filterOptions.categories && filterOptions.categories.length
                  "
                  title="Categorias"
                  no-body
                  class="mb-3 d-none d-md-block"
                >
                  <b-list-group flush>
                    <b-list-group-item
                      v-for="category in filterOptions.categories"
                      :key="category"
                      class="pointer"
                      :class="
                        category === filters.category
                          ? 'bg-secondary'
                          : 'bg-primary'
                      "
                      @click="addFilter('category', category)"
                    >
                      {{ category }}
                    </b-list-group-item>
                    <b-list-group-item
                      v-if="filters.category"
                      class="bg-primary pointer"
                      @click="addFilter('category', '')"
                    >
                      Todas as categorias
                    </b-list-group-item>
                  </b-list-group>
                </b-card>
                <b-form-select
                  v-model="filters.category"
                  :options="filterOptions.categories"
                  class="mb-3 d-md-none"
                  @input="filter()"
                >
                  <template v-slot:first>
                    <b-form-select-option value="">
                      Todas as categorias
                    </b-form-select-option>
                  </template>
                </b-form-select>
                <b-form-select
                  v-model="filters.language"
                  :options="filterOptions.languages"
                  class="mb-3"
                  @input="filter()"
                >
                  <template v-slot:first>
                    <b-form-select-option value="">
                      Todos os idiomas
                    </b-form-select-option>
                  </template>
                </b-form-select>
              </div>
            </b-col>
            <b-col id="media-list" md="9" class="medias">
              <div v-if="medias">
                <div class="mb-3">
                  <Found :total="medias.pagination.total" /><span
                    v-if="filters.category"
                    class="text-primary"
                  >
                    em <strong>{{ filters.category }}</strong></span>
                </div>
                <ul class="list-unstyled">
                  <div v-for="m in medias.data" :key="m._id" tag="li" class="border-top py-3">
                    <div v-if="m.image || m.oembed_thumb" class="mb-3 text-center text-md-left">
                      <img :src="m.image ? m.image.thumb : m.oembed_thumb" :alt="m.title" style="max-width: 160px;">
                    </div>
                    <b-badge v-if="m.type" class="mb-2">{{ m.type }}</b-badge>
                    <p class="mb-0">
                      <n-link :to="{ path: '/biblioteca', query: {...filters, media: m._id} }"><strong>{{ m.title }}</strong></n-link>
                    </p>
                    <p class="mb-0">
                      <small>{{ m.description | truncate(200) }}</small>
                    </p>
                  </div>
                </ul>
                <b-pagination
                  v-if="medias.pagination.total > medias.pagination.per_page"
                  v-model="page"
                  :total-rows="medias.pagination.total"
                  :per-page="medias.pagination.per_page"
                  aria-controls="my-table"
                  @input="list"
                />
              </div>
              <Media v-if="media" :media="media" @close="close" />
            </b-col>
          </b-row>
          <span v-if="!medias && !media">
            <b-spinner small /> Carregando...
          </span>
        </div>
      </b-container>
    </section>
  </div>
</template>
<script>
import categories from '@/data/categories'
import features from '@/data/features'
export default {
  async asyncData({ params, query, $axios }) {
    const medias = await $axios.$get('/api/medias', {
      params: { page: 1, ...query }
    })
    return { medias }
  },
  data() {
    return {
      medias: null,
      media: null,
      page: 1,
      tags: [],
      categories,
      filters: {
        tag: this.$route.query.tag || '',
        category: this.$route.query.category || '',
        search: this.$route.query.search || '',
        type: this.$route.query.type || '',
        language: this.$route.query.language || ''
      }
    }
  },
  computed: {
    filterOptions() {
      return this.$store.state.media_filters
    },
    baseUrl() {
      return process.env.BASE_URL
    },
    settings() {
      return this.$store.state.settings
    },
    title() {
      if (
        this.settings &&
        this.settings.features &&
        this.settings.features.medias &&
        this.settings.features.medias.title
      ) {
        return this.settings.features.medias.title
      }
      return features.medias.title
    }
  },
  watch: {
    $route(to) {
      if (this.$route.query.media) {
        this.open(this.$route.query.media)
      } else {
        Object.keys(this.filters).forEach(key => {
          this.filters[key] = to.query[key] || ''
        })
        this.list()
      }
    }
  },
  async created() {
    if (this.$route.query.media) {
      this.open(this.$route.query.media)
    }

    if (!this.filterOptions) {
      const filterOptions = await this.$axios.$get('/api/medias/filters')
      this.$store.commit('setMediaFilters', filterOptions)
    }
  },
  methods: {
    async list() {
      this.media = null
      this.medias = await this.$axios.$get('/api/medias', {
        params: { page: this.page, ...this.filters }
      })
    },
    addFilter(key, value) {
      this.filters[key] = value
      this.filter()
    },
    filter() {
      this.page = 1
      this.$router.push({ path: '/biblioteca', query: this.filters })
    },
    open(id) {
      this.media = this.medias.data.find(m => m._id === id)
    },
    close() {
      this.$router.push({ path: '/biblioteca', query: this.filters })
    },
    clearFilters() {
      this.filters.search = ''
      this.filters.tag = ''
      this.filters.category = ''
      this.filters.type = ''
      this.filters.language = ''
      this.list()
    }
  }
}
</script>
