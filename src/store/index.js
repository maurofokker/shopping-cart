import Vuex from 'vuex'
import Vue from 'vue'

// tells Vue to use Vuex
Vue.use(Vuex)

// creates a Vuex Store
new Vuex.Store({
  state: { // same as data in Vue
    products: []
  },

  getters: {  // same as computed properties in Vue
    productsCount () {
      // return the length of the products array
    }
  },

  actions: { // same as components methods
    fetchProducts () { // perform API call to fetch the products

    }
  },

  mutations: { // responsible for setting and updating the state
    setProducts () {
      // update products
    }
  }

})
