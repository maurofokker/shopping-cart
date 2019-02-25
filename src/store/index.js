import Vuex from 'vuex'
import Vue from 'vue'
import shop from '@/api/shop'
import { resolve } from 'uri-js';

// tells Vue to use Vuex
Vue.use(Vuex)

// creates a Vuex Store
export default new Vuex.Store({
  state: { // same as data in Vue
    products: []
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
    }
  },

  mutations: { // responsible for setting and updating the state
    setProducts (state, products) { // first parameter will always be the current state and the second the payload
      // update products
      state.products = products
    }
  }

})
