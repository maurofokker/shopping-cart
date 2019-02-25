import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'
import { resolve } from 'uri-js';

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

  actions: { // same as components methods
    fetchProducts (context) {
      return new Promise((resolve, reject) => {
        shop.getProducts(products => {
          // we need to commit a mutation passing the name of the mutation
          // and passing the payload that is the returned products
          context.commit('setProducts', products)
          resolve()
        })
      })
    },
    // it is better to use discrete names to know what the action or mutation does by reading its name
    addProductToCart ({state, getters, commit}, product) {
      if (getters.productIsInStock(product)) {
        // find cartItem
        const cartItem = state.cart.find(item => item.id === product.id)
        if (!cartItem) { // push product to cart
          commit('pushProductToCart', product.id)
        } else { // increment item quantity
          commit('incrementItemQuantity', cartItem)
        }
        commit('decrementProductInventory', product) // pass incoming product to decrement inventory
      }
    },

    checkout ({commit, state}) {
      shop.buyProducts(
        state.cart, // 1st products / cart
        () => { // 2nd success cb
          commit('emptyCart')
          commit('setCheckoutStatus', 'success')
        },
        () => { // 3rd failure cb
          commit('setCheckoutStatus', 'fail')
        }
      )
    }
  },

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
