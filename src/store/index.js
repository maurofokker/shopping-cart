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
    cart: []
  },

  getters: {  // same as computed properties in Vue
    availableProducts (state, getters) {
      return state.products.filter(product => product.inventory > 0)
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
    addProductToCart (context, product) {
      if (product.inventory > 0) {
        // find cartItem
        const cartItem = context.state.cart.find(item => item.id === product.id)
        if (!cartItem) { // push product to cart
          context.commit('pushProductToCart', product.id)
        } else { // increment item quantity
          context.commit('incrementItemQuantity', cartItem)
        }
        context.commit('decrementProductInventory', product) // pass incoming product to decrement inventory
      }
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
    }
  }

})
