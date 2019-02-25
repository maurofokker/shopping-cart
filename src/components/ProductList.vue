<template>
  <div>
    <h1>Product List</h1>
    <img
      v-if="loading"
      src="https://i.imgur.com/JfPpwOA.gif"
      alt="">
    <ul v-else>
      <li
        v-for="product in products"
        :key="product.id"
      >
        {{product.title}} - {{product.price | currency}} - {{product.inventory}}
        <button
          :disabled="!productIsInStock(product)"
          @click="addProductToCart(product)"
        >Add to cart
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

export default {

  data () {
    return {
      loading: false,
      productIndex: 1
    }
  },
  computed: {
    // FROM
    // products () {
    //     return this.$store.state.products
    // },
    // TO
    ...mapState({
      // products: state => state.products
      products: state => state.products.items
    }),

    // FROM
    // productIsInStock () {
    //   return this.$store.getters.productIsInStock
    // }
    // TO
    ...mapGetters({
      productIsInStock: 'productIsInStock' // use key: value if you want to use another name in component with the key
    })
  },

  methods: {
    // FROM
    // addProductToCart (product) {
    //   this.$store.dispatch('addProductToCart', product)
    // }
    // TO
    ...mapActions({
      fetchProducts: 'fetchProducts',
      addProductToCart: 'addProductToCart'
    })
  },
  // created hook: everyting you put here will run right after the instace is created
  created () {
    this.loading = true
    // FROM
    // this.$store.dispatch('fetchProducts')
    //   .then(() => this.loading = false)
    // TO     <- replace $store.dispatch with mapActions helper
    this.fetchProducts()
      .then(() => this.loading = false)
  }
}
</script>

<style>

</style>
