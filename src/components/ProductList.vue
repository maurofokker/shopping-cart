<template>
  <div>
    <h1>Product List</h1>
    <ul>
      <li v-for="product in products" :key="product.id">{{product.title}} - {{product.price}}</li>
    </ul>
  </div>
</template>

<script>
import shop from '@/api/shop'
import store from '@/store/index'

export default {

  // data () {..} is not used because we keep data is stored globally in the state
  computed: {
    products () {
      return store.state.products
    }
  },
  // created hook: everyting you put here will run right after the instace is created
  created () {
    shop.getProducts(products => {
      // we need to commit a mutation passing the name of the mutation
      // and passing the payload that is the returned products
      store.commit('setProducts', products)
    })
  }
}
</script>

<style>

</style>
