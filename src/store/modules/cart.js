import shop from "@/api/shop";

export default {
  namespaced: true,

  state: {
    // {id, quantity}
    items: [],
    checkoutStatus: null
  },

  getters: {
    // 1st parameter is the local state and correspond to the module state option
    // 2nd are the getters
    // 3rd parameter is the rootState allows to access to state outside the module we need to reference to the global state
    //  aka rootState
    cartProducts (state, getters, rootState, rootGetters) {
      return state.items.map(cartItem => {
        const product = rootState.products.items.find(product => product.id === cartItem.id)
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity
        }
      })
    },

    cartTotal (state, getters) {
      return getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0)
    },
  },

  mutations: {
    pushProductToCart (state, productId) {
      state.items.push({
        id: productId,
        quantity: 1
      })
    },

    incrementItemQuantity (state, cartItem) {
      cartItem.quantity++
    },

    setCheckoutStatus (state, status) {
      state.checkoutStatus = status
    },

    emptyCart (state) {
      state.items = []
    }
  },

  actions: {
    // inside the context the global state is exposed as rootState too
    addProductToCart({state, getters, commit, rootState, rootGetters}, product) {
      if (rootGetters['products/productIsInStock'](product)) { // using getter outside module scope
        const cartItem = state.items.find(item => item.id === product.id)
        if (!cartItem) {
          commit('pushProductToCart', product.id)
        } else {
          commit('incrementItemQuantity', cartItem)
        }
        commit('products/decrementProductInventory', product, {root: true}) // to dispatch or commit mutations starting from the global namespace
      }
    },

    checkout({state, commit}) {
      shop.buyProducts(
        state.items,
        () => {
          commit('emptyCart')
          commit('setCheckoutStatus', 'success')
        },
        () => {
          commit('setCheckoutStatus', 'fail')
        }
      )
    }
  }
}
