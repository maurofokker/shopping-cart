<template>
  <div>
    <h1>Shopping cart</h1>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{product.title}} - {{product.price | currency}} - {{product.quantity}}
      </li>
    </ul>
    <p>Total: {{total | currency }}</p>
    <button @click="checkout">Checkout</button>
    <p v-if="checkoutStatus">{{checkoutStatus}}</p>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

export default {
  computed: {
      // FROM
      // products () {
      //   return this.$store.getters.cartProducts
      // },

      // total () {
      //   return this.$store.getters.cartTotal
      // }
      // TO
      ...mapGetters('cart', {
        products: 'cartProducts',
        total: 'cartTotal'
      }),

      ...mapState('cart', {
        // checkoutStatus: 'checkoutStatus'
        // using modules should be
        // from state.cart.checkoutStatus => to state.checkoutStatus bc we are using the namespace
        checkoutStatus: state => state.checkoutStatus
      })
    },

    methods: {
      ...mapActions('cart', ['checkout']) // it can accept array or object, 1st parameter is the namespace
    }
}
</script>

<style>

</style>
