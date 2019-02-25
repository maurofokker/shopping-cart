import Vuex from 'vuex'
import Vue from 'vue'

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
    fetchProducts () { // perform API call to fetch the products
      // make the call
      // run setProducts mutation
    }
  },

  mutations: { // responsible for setting and updating the state
    setProducts (state, products) { // first parameter will always be the current state and the second the payload
      // update products
      state.products = products
    }
  }

})
