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
