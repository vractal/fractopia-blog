<template>
  <b-container>
    <h1>Coisas salvas</h1>
    <div class="saved-container">
      <b-card v-for="item in saved" :key="item._id" class="saved-card bg-light" :title="item.title">
        <b-card-text v-html="item.original_content" />

        <!-- <b-link href="#" class="card-link">Another link</b-link> -->
        <b-button @click="() => deleteItem(item)">
          <b-icon-trash />
        </b-button>
      </b-card>
    </div>
  </b-container>
</template>

<script>
export default {
  data: () => ({
    saved: []
  }),
  computed: {
    settings () {
      return this.$store.state.settings
    }
  },
  created () {
    this.fetchSaved()
  },
  methods: {
    fetchSaved () {
      this.$axios.get('/api/saved').then(response => {
        this.saved = response.data
      })
    },
    deleteItem(item) {
      this.$axios.delete('/api/saved/' + item._id).then(response => {
        this.fetchSaved()
      })
    }
  }
}
</script>
<style scoped>
.saved-container {
  display: flex;
  flex-wrap: wrap;
  padding: 14px;
}

.saved-card {
  max-width: 400px;
  margin: 10px;
}
</style>
