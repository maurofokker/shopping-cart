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

### Steps to use vuex

1. Add `vuex` to the app with `yarn add vuex` or `npm install vuex`
2. Create the container store that will hold the whole application state (`@/store/index.js`)

  ```js
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
  ```
