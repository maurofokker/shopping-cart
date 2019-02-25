import Vuex from 'vuex'
import Vue from 'vue'
import actions from './actions'
import cart from './modules/cart'
import products from './modules/products'

// tells Vue to use Vuex
Vue.use(Vuex)

// creates a Vuex Store
export default new Vuex.Store({

  modules: {
    cart,
    products
  },

  state: { // same as data in Vue

  },

  getters: {  // same as computed properties in Vue

  },

  actions,

  mutations: { // responsible for setting and updating the state

  }

})
