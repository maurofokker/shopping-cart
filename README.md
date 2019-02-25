# shopping-cart

> vuex example

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Vuex

- `Vuex` is a state management library for Vue applications
- It serves as a centralized data store for all components in an application
- It enforces to ensure that we interact with the state in a predictable fashion
- We can rely in our components telling vuex to update the state, instead of changing
the data directly
- It is debugable, every time vuex change it state, the change is tracked and can
be presented in a history log

- Vuex will help you deal with state management but it also comes with the cost of
more concepts and boilerplate leading to a trade off between short term and long
term productivity
- If the app is quite small or simple you can stick to managing state within components
- You can start moving pieces of state to Vuex when juggling between components
feels more complex thax Vuex does

### Steps to use vuex

1. Add `vuex` to the app with `yarn add vuex` or `npm install vuex`
2. Create the container store that will hold the whole application state (`@/store/index.js`)

  ```js
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
      productsCount () {
        // return the length of the products array
      }
    },

    actions: { // same as components methods
      fetchProducts () { // perform API call to fetch the products

      }
    },

    mutations: { // responsible for setting and updating the state
      setProducts (state, payload) { // first parameter will always be the current state and the second the payload
        // update products
      }
    }

  })
  ```
#### Vuex State option: `mapState` Helper

- When a component needs to make use of multiple store state properties or getters, declaring all these computed properties can get repetitive and verbose.
- We can make use of the mapState helper which generates computed getter functions for us

  ```jsx
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
  import {mapState} from 'vuex'

  export default {
    computed: {
        ...mapState({
          checkoutStatus: 'checkoutStatus'
        })
      },
  }
  </script>
  ```

  - Above we have replaced in template from `$store.state.checkoutStatus` to use just the _mapGetter_ `checkoutStatus`

#### Vuex Options: Mutations

- Mutations are wrappers around individual state changes
- Mutations should always be used to update the state
- Never update state directly calling a mutation instead you need to `commit` a mutation
- Declaring a mutation [vuex reference](https://vuex.vuejs.org/guide/mutations.html)

  ```js
  export default new Vuex.Store({
    state: { // same as data in Vue
      products: []
    },

    // getters, actions

    mutations: { // responsible for setting and updating the state
      setProducts (state, products) { // first parameter will always be the current state and the second the payload
        // update products
        state.products = products
      }
    }

  })
  ```

- Using store and updating state

  ```js
  import shop from '@/api/shop'
  import store from '@/store/index'

  export default {

    // data () {..} is not used because we keep data is stored globally in the state
    computed: {
      products () {
        return store.state.products
      }
    },
    // hook will run right after the instace is created
    created () {
      shop.getProducts(products => {
        // we need to commit a mutation passing the name of the mutation
        // and passing the payload that is the returned products
        store.commit('setProducts', products)
      })
    }
  }
  ```

> In Vuex, actions are responsible for the logic of when a mutation should be dispatched, while each mutation is only responsible for one single state change.

#### Vuex Options: Getters

- Vuex `getters` are like `computer properties`
- They are perfect when you need to filter or calculate something at runtime
- As _computed properties_ `getters` track their own dependencies and automatically update when a dependency changes
- `getters` accept `state` as first argument and other `getters` as the second argument
- [vuex getter reference](https://vuex.vuejs.org/guide/getters.html)

  ```js
  export default new Vuex.Store({
    state: { // same as data in Vue
      products: []
    },

    getters: {  // same as computed properties in Vue
      availableProducts (state, getters) {
        return state.products.filter(product => product.inventory > 0)
      }
    },

    // actions, mutations

  })
  ```

- Using getters

  ```js
  import shop from '@/api/shop'
  import store from '@/store/index'

  export default {

    computed: {
      products () { // accessing to getters in store
        return store.getters.availableProducts
      }
    },
    created () {
      shop.getProducts(products => {
        // use mutation
      })
    }
  }
  ```

##### Advanced Vuex Option: Dynamic Getters

- High order functions allow to create dynamic getters
- Dynamic getters allows us to pass arguments to getters, useful if you wanna query the store
- Common use case: create a getter to find an item in the state using its _id_

  ```js
  getProductById (state, getters) {
    return id => {
      return state.products.find(product => product.id === id)
    }
  }
  ```

- Creating a dynamic getter in store

  ```js
    getters: {  // same as computed properties in Vue
      productIsInStock () {
        return (product) => {
          return product.inventory > 0
        }
      }
    },
  ```

- Using dynamic getter in component

  ```jsx
  <template>
    <div>
      <button
        :disabled="!productIsInStock(product)"
        @click="addProductToCart(product)"
      >Add to cart
      </button>
    </div>
  </template>

  <script>

  export default {

    computed: {
      productIsInStock () {
        return this.$store.getters.productIsInStock
      }
    },

    methods: {
      addProductToCart (product) {
        this.$store.dispatch('addProductToCart', product)
      }
    },
  }
  </script>
  ```

##### `mapGetters` Helper

- This helper simply maps _getters_ to local computed properties
- _mapGetter_ accepts an array or object as parameter
- You can use `...` spread object operator to mix _getters_ with local component computed properties

  ```jsx
  <template>
    <div>
      <h1>Shopping cart</h1>
      <ul>
        <li v-for="product in products" :key="product.id">
          {{product.title}} - {{product.price | currency}} - {{product.quantity}}
        </li>
      </ul>
      <p>Total: {{total | currency }}</p>
    </div>
  </template>
  <script>
  import {mapGetters} from 'vuex'

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
        ...mapGetters({
          products: 'cartProducts',
          total: 'cartTotal'
        })
      },
  }
  </script>
  ```

#### Vuex Options: Actions

- Actions are similar to mutations, the differences being that:
  - Instead of mutating the state, actions commit mutations.
  - Actions can contain arbitrary asynchronous operations.
- [Vuex actions reference](https://vuex.vuejs.org/guide/actions.html)
- Action handlers receive a `context` object which exposes the same set of methods/properties on the store instance, so you can call _context.commit_ to commit a mutation, or access the state with _context.state_
- Using ES6 object destructuring in argument we can do `myAction({commit, state})` instead of `myAction(context)`
- Actions are triggered with the `store.dispatch` method
- Mutations have to be _synchronous_ so it is bad calling directly but actions can perform _asynchronous_ operations

  ```js
  import shop from '@/api/shop'
  export default new Vuex.Store({
    state: { // same as data in Vue
      products: []
    },

    actions: { // same as components methods
      fetchProducts ({commit}) {
        return new Promise((resolve, reject) => {
          shop.getProducts(products => {
            // we need to commit a mutation passing the name of the mutation
            // and passing the payload that is the returned products
            commit('setProducts', products)
            resolve()
          })
        })
      }
    },

    // getters, mutations

  })
  ```

- Triggering an action

  ```jsx
  <template>
    <div>
      <h1>Product List</h1>
      <img
        v-if="loading"
        src="https://i.imgur.com/JfPpwOA.gif"
        alt="">
      <ul v-else>
        <li v-for="product in products" :key="product.id">{{product.title}} - {{product.price}}</li>
      </ul>
    </div>
  </template>

  <script>
  import store from '@/store/index'

  export default {

    data () {
      return {
        loading: false
      }
    },
    computed: {
      products () {
        return store.getters.availableProducts
      }
    },
    // created hook: everyting you put here will run right after the instace is created
    created () {
      this.loading = true
      store.dispatch('fetchProducts')
        .then(() => this.loading = false)
    }
  }
  </script>
  ```

> In Vuex, actions are responsible for the logic of when a mutation should be dispatched, while each mutation is only responsible for one single state change.

##### `mapActions` Helper

- You can dispatch actions in components with `this.$store.dispatch('xxx')`, or use the `mapActions` helper
- `mapActions` maps component methods to `store.dispatch` calls (requires root store injection)

  ```jsx
  <template>
    <div>
      <h1>Product List</h1>
      <img
        v-if="loading"
        src="https://i.imgur.com/JfPpwOA.gif"
        alt="">
      <ul v-else>
        <li
          v-for="product in products"
          :key="product.id"
        >
          {{product.title}} - {{product.price | currency}} - {{product.inventory}}
          <button
            :disabled="!productIsInStock(product)"
            @click="addProductToCart(product)"
          >Add to cart
          </button>
        </li>
      </ul>
    </div>
  </template>

  <script>
  import {mapActions} from 'vuex'

  export default {

    data () {
      // data
    },
    computed: {
      // computed properties ... mapGetters ... mapState
    },

    methods: {
      // FROM
      // addProductToCart (product) {
      //   this.$store.dispatch('addProductToCart', product)
      // }
      // TO
      ...mapActions({
        fetchProducts: 'fetchProducts',
        addProductToCart: 'addProductToCart'
      })
    },
    // created hook: everyting you put here will run right after the instace is created
    created () {
      this.loading = true
      // FROM
      // this.$store.dispatch('fetchProducts')
      //   .then(() => this.loading = false)
      // TO     <- replace $store.dispatch with mapActions helper
      this.fetchProducts()  // reuse of method from mapActions
        .then(() => this.loading = false)
    }
  }
  </script>
  ```

- `mapActions` can accept payloads

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'incrementBy' // map `this.incrementBy(amount)` to `this.$store.dispatch('incrementBy', amount)`
    ])
  }
}
```

#### Using store globally

- We can pass `store` as an option in the `Vue` instance

  ```js
  // main.js
  import Vue from 'vue'
  import App from './App'
  import store from '@/store/index'

  Vue.config.productionTip = false

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,
    render: h => h(App)
  })

  ```

- The global store is now available in components using `this.$store`

  ```js
  // ProductList.vue
  export default {

    data () {
      return {
        loading: false
      }
    },
    computed: {
      products () {
        return this.$store.getters.availableProducts
      }
    },
    // created hook: everyting you put here will run right after the instace is created
    created () {
      this.loading = true
      this.$store.dispatch('fetchProducts')
        .then(() => this.loading = false)
    }
  }
  ```

### Vuex Modules

- As our application grows in scale, the store can get really bloated
- Modules can contain its own state, mutations, actions and getters and even nested modules
- [Vuex modules reference](https://vuex.vuejs.org/guide/modules.html)
- A module can contain all the logic about the cart, and another module can contain the logic about authentication
- Modules export an object with state, mutations, actions, getters options

  ```js
  export default {
    state: {},
    getters: {},
    mutations: {}
  }
  ```

- Project modules can be found on `src/store/modules/cart.js` and `src/store/modules/products.js`
- To reference a state outside the module we need to reference to the `global state` _aka_ `root state`
  - In _Getters_ the `root state` is passed as 3rd parameter `cartProducts (state, getters, rootState) {..}`
  - In _Actions_ the `root state` is inside the _context_ in the first parameter `addProductToCart({state, getters, commit, rootState}, product) {..}`

#### Namespacing

- By default, actions, mutations and getters inside modules are still registered under the _global namespace_ this allows multiple modules to react to the same mutation/action type (_names are the same in the modules_)
- Modules must bu marked as `namespaced: true,` in the options to be more sef-contained
- When module is namespaced local getters, dispatch and commit doesnt need to be prefixed with the module name inside the same module
- To use global state and getters you can use _rootState_ and _rootGetters_ passed as 3rd and 4th arguments to _getter_ functions, and also exposed as properties on the _context object_ passed to action functions.
- To _dispatch actions_ or _commit mutations_ starting in the global namespace, pass `{root: true}` as the 3rd argument to `dispatch` and `commit`

  ```js
  export default {
    namespaced: true,

    getters: {
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
          commit('products/decrementProductInventory', product, {root: true})
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
  ```

- [Oficial Vuex namespacing reference](https://vuex.vuejs.org/guide/modules.html#namespacing)

## Vue Filters

- [Filters Guide](https://vuejs.org/v2/guide/filters.html)
- Allow to apply common text formatting
- Can be used with _mustache interpolations {{}}_ and _v-bind expressions_
- Should be appended at the end of the js expression denoted by the _| pipe symbol_
- Global filter definition in `main.js`

  ```js
  import Vue from 'vue'
  import App from './App'
  import store from '@/store/index'
  import {currency} from '@/currency'

  Vue.config.productionTip = false
  Vue.filter('currency', currency)  // set the currency filter globally

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,
    render: h => h(App)
  })
  ```

- Filter can be defined locally in components options (from reference)
  ```js
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
  ```
