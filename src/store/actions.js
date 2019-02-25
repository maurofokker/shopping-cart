import shop from '@/api/shop'

export default { // same as components methods
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
}
