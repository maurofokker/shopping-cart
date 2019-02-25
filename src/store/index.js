import Vuex from 'vuex'
import Vue from 'vue'
import actions from './actions'

// tells Vue to use Vuex
Vue.use(Vuex)

// creates a Vuex Store
export default new Vuex.Store({
  state: { // same as data in Vue
    products: [],
    // {id, quantity}
    cart: [],
    checkoutStatus: null
  },

  getters: {  // same as computed properties in Vue
    availableProducts (state, getters) {
      return state.products.filter(product => product.inventory > 0)
    },

    cartProducts (state) {
      return state.cart.map(cartItem => {
        const product = state.products.find(product => product.id === cartItem.id)
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      })
    },

    cartTotal (state, getters) {
      // let total = 0
      // getters.cartProducts.forEach(product => {
      //   total += product.price * product.quantity
      // })
      // return total
      return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)
    },

    productIsInStock () {
      return (product) => {
        return product.inventory > 0
      }
    }
  },

  actions,

  mutations: { // responsible for setting and updating the state
    setProducts (state, products) { // first parameter will always be the current state and the second the payload
      // update products
      state.products = products
    },

    pushProductToCart (state, productId) {
      state.cart.push({
        id: productId,
        quantity: 1
      })
    },

    incrementItemQuantity (state, cartItem) {
      cartItem.quantity++
    },

    decrementProductInventory (state, product) {
      product.inventory--
    },

    setCheckoutStatus (state, status) {
      state.checkoutStatus = status
    },

    emptyCart (state) {
      state.cart = []
    }
  }

})
