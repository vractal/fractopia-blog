<template>
  <div>
    <Breadcrumb
      :active="title"
    />
    <section class="content pb-5">
      <Page slug="noticias" :breadcrumb="false" />
      <b-container>
        <Tags :selected="selectedTag" :tags="availableTags" @click="handleTagSelection" />
        <div v-if="filteredPosts">
          <Posts :posts="filteredPosts" />
          <div v-if="filteredPosts.length === 0" class="alert text-center">Nenhuma notícia encontrada</div>
          <!-- <share /> -->
        </div>
      </b-container>
    </section>
  </div>
</template>

<script>
import features from '@/data/features'
export default {
  data () {
    return {
      posts: null
    }
  },
  computed: {
    settings() {
      return this.$store.state.settings
    },
    title() {
      if (this.settings && this.settings.features && this.settings.features.posts && this.settings.features.posts.title) {
        return this.settings.features.posts.title
      }
      return features.posts.title
    },
    availableTags() {
      // TODO: This is still not getting from the API all available tags, not sure how to handle this.
      if (!this.posts) {
        return []
      }
      const tags = new Set()
      this.posts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag))
      })
      return Array.from(tags).sort()
    },
    filteredPosts() {
      if (!this.posts) {
        return []
      }
      if (!this.selectedTag) {
        return this.posts
      } else {
        return this.posts.filter(post => {
          return post.tags.includes(this.selectedTag)
        })
      }
    },
    selectedTag() {
      return this.$route.query.tag ? this.$route.query.tag
        : ''
    }
  },
  watch: {
    '$route.params.tag'(newValue, oldValue) {
      // Recalculate filteredPosts when the tag parameter changes
      if (newValue !== oldValue) {
        this.$nextTick(() => {
          this.selectedTag()
        })
      }
    }
  },
  async created() {
    this.posts = await this.$axios.$get('/api/posts', { params: this.$route.query })
  },
  methods: {
    handleTagSelection(tag) {
      // Get the current route query parameters
      const query = { ...this.$route.query }

      if (tag !== '') {
        query.tag = tag
      } else {
        delete query.tag
      }

      // Change the route to include the new query parameters
      this.$router.push({ path: this.$route.path, query })
    }
  }
}
</script>
