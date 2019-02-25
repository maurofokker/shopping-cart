<template>
  <div>
    <h1>Product List</h1>
    <img
      v-if="loading"
      src="https://i.imgur.com/JfPpwOA.gif"
      alt="">
    <ul v-else>
      <li v-for="product in products" :key="product.id">{{product.title}} - {{product.price}}</li>
    </ul>
  </div>
</template>

<script>
import store from '@/store/index'

export default {

  data () {
    return {
      loading: false
    }
  },
  computed: {
    products () {
      return store.getters.availableProducts
    }
  },
  // created hook: everyting you put here will run right after the instace is created
  created () {
    this.loading = true
    store.dispatch('fetchProducts')
      .then(() => this.loading = false)
  }
}
</script>

<style>

</style>
