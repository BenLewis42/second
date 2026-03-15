---
title: Vue.js
category: CS
tags:
  - vue
  - javascript
  - frontend
  - framework
date: '2025-10-14'
excerpt: 'Vue.js 3 essential training cheatsheet covering directives, reactivity, components, routing, transitions, and project structure.'
stub: false
verified: false
notionId: 28ca584d-bff3-8091-a13c-dc4731a6de7f
---

# Vue.js 3 Essential Training Cheatsheet

Vue.js is a progressive JavaScript framework for building user interfaces. It focuses on the view layer and is designed to be incrementally adoptable.

---

## Getting Started

### Installation Options

**Via CDN (quickest for learning):**

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

**Via npm (for production projects):**

```bash
npm install vue@next
```

**Via Vue CLI (full-featured projects):**

```bash
npm install -g @vue/cli
vue create my-project
```

### Basic Setup

**HTML Structure:**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Vue App</title>
  <script src="https://unpkg.com/vue@3"></script>
</head>
<body>
  <div id="app">
    {{ message }}
  </div>

  <script>
    const { createApp } = Vue;

    createApp({
      data() {
        return {
          message: 'Hello Vue!'
        }
      }
    }).mount('#app');
  </script>
</body>
</html>
```

**Key Concepts:**
- Use `createApp()` to create a Vue application instance
- Use `data()` function to return reactive state
- Mount the app to a DOM element with `.mount()`
- Use mustache syntax `{{ }}` for text interpolation

---

## Directives

Directives are special attributes that apply reactive behavior to the DOM.

### Binding with Directives

**v-bind (or : shorthand)** - Bind attributes dynamically:

```html
<img v-bind:src="imageSrc">
<!-- Shorthand -->
<img :src="imageSrc">

<a :href="url">Link</a>
<div :class="className"></div>
<button :disabled="isDisabled">Click</button>
```

**v-model** - Two-way data binding:

```html
<input v-model="message">
<p>{{ message }}</p>
```

**v-on (or @ shorthand)** - Attach event listeners:

```html
<button v-on:click="doSomething">Click</button>
<!-- Shorthand -->
<button @click="doSomething">Click</button>
```

### Rendering Lists

**v-for** - Render lists of items:

```html
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</ul>

<!-- With index -->
<li v-for="(item, index) in items" :key="item.id">
  {{ index }}: {{ item.name }}
</li>

<!-- Iterating over objects -->
<div v-for="(value, key) in object" :key="key">
  {{ key }}: {{ value }}
</div>
```

Always use `:key` with `v-for` for proper list rendering and performance.

### Conditional Rendering

**v-if, v-else-if, v-else** - Conditionally render elements:

```html
<div v-if="type === 'A'">Type A</div>
<div v-else-if="type === 'B'">Type B</div>
<div v-else>Not A or B</div>
```

**v-show** - Toggle element visibility (keeps element in DOM):

```html
<div v-show="isVisible">Toggle me</div>
```

**Difference:**
- `v-if` removes/adds elements from DOM (better for infrequent toggles)
- `v-show` toggles CSS display property (better for frequent toggles)

---

## Managing Reactivity

### Input Fields

**Text Input:**

```html
<input v-model="username" type="text">
<p>Username: {{ username }}</p>
```

**Textarea:**

```html
<textarea v-model="message"></textarea>
```

**Checkbox:**

```html
<!-- Single checkbox -->
<input type="checkbox" v-model="checked">

<!-- Multiple checkboxes (array) -->
<input type="checkbox" v-model="checkedNames" value="John">
<input type="checkbox" v-model="checkedNames" value="Jane">
```

**Radio Buttons:**

```html
<input type="radio" v-model="picked" value="One">
<input type="radio" v-model="picked" value="Two">
```

**Select:**

```html
<select v-model="selected">
  <option disabled value="">Choose one</option>
  <option>Option A</option>
  <option>Option B</option>
</select>
```

**Modifiers:**

```html
<!-- Update on change event instead of input -->
<input v-model.lazy="msg">

<!-- Auto-convert to number -->
<input v-model.number="age" type="number">

<!-- Trim whitespace -->
<input v-model.trim="msg">
```

### Computed Properties

Computed properties are cached based on their reactive dependencies and only re-evaluate when dependencies change.

```javascript
createApp({
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      items: [1, 2, 3, 4, 5]
    }
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    evenNumbers() {
      return this.items.filter(n => n % 2 === 0);
    },
    fullNameWithSetter: {
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
      set(value) {
        const names = value.split(' ');
        this.firstName = names[0];
        this.lastName = names[names.length - 1];
      }
    }
  }
}).mount('#app');
```

**Usage in template:**

```html
<p>{{ fullName }}</p>
<p>{{ evenNumbers }}</p>
```

**Computed vs Methods:**
- Computed properties are cached and only recalculate when dependencies change
- Methods execute every time they're called
- Use computed for derived state, methods for actions

### Event Handling

**Basic Event Handling:**

```html
<button @click="count++">Add 1</button>
<button @click="greet">Greet</button>
```

**Methods:**

```javascript
createApp({
  data() {
    return {
      count: 0,
      name: 'Vue.js'
    }
  },
  methods: {
    greet(event) {
      alert(`Hello ${this.name}!`);
      if (event) {
        alert(event.target.tagName);
      }
    },
    say(message) {
      alert(message);
    }
  }
}).mount('#app');
```

**Inline Handlers with Arguments:**

```html
<button @click="say('hello')">Say hello</button>
<button @click="say('goodbye')">Say goodbye</button>
```

**Event Modifiers:**

```html
<!-- Prevent default behavior -->
<form @submit.prevent="onSubmit"></form>

<!-- Stop propagation -->
<div @click.stop="doThis"></div>

<!-- Modifiers can be chained -->
<a @click.stop.prevent="doThat"></a>

<!-- Only trigger if event.target is the element itself -->
<div @click.self="doThat">...</div>

<!-- Trigger only once -->
<button @click.once="doThis"></button>
```

**Key Modifiers:**

```html
<!-- Only call when Enter is pressed -->
<input @keyup.enter="submit">

<!-- Common key aliases: .enter, .tab, .delete, .esc, .space, .up, .down, .left, .right -->
<input @keyup.delete="remove">
```

**Mouse Button Modifiers:**

```html
<button @click.left="handleLeft"></button>
<button @click.right="handleRight"></button>
<button @click.middle="handleMiddle"></button>
```

### Lifecycle Hooks

Lifecycle hooks let you execute code at specific stages of a component's lifecycle.

```javascript
createApp({
  data() {
    return {
      message: 'Hello'
    }
  },
  beforeCreate() {
    console.log('beforeCreate');
  },
  created() {
    console.log('created');
  },
  beforeMount() {
    console.log('beforeMount');
  },
  mounted() {
    console.log('mounted');
  },
  beforeUpdate() {
    console.log('beforeUpdate');
  },
  updated() {
    console.log('updated');
  },
  beforeUnmount() {
    console.log('beforeUnmount');
  },
  unmounted() {
    console.log('unmounted');
  }
}).mount('#app');
```

**Common Use Cases:**
- `created()` - Fetch data from API
- `mounted()` - Access DOM elements, initialize third-party libraries
- `beforeUnmount()` - Clean up timers, event listeners, subscriptions
- `updated()` - React to data changes (use sparingly, prefer watchers/computed)

---

## Styles and Animation

### Inline Styles

**Binding Inline Styles:**

```html
<!-- Object syntax -->
<div :style="{ color: textColor, fontSize: fontSize + 'px' }"></div>

<!-- Cleaner with data property -->
<div :style="styleObject"></div>
```

```javascript
data() {
  return {
    textColor: 'red',
    fontSize: 14,
    styleObject: {
      color: 'blue',
      fontSize: '20px',
      fontWeight: 'bold'
    }
  }
}
```

**Array Syntax (multiple style objects):**

```html
<div :style="[baseStyles, additionalStyles]"></div>
```

Vue automatically adds vendor prefixes when needed for CSS properties.

### Class Binding

**Object Syntax:**

```html
<div :class="{ active: isActive, 'text-danger': hasError }"></div>
```

```javascript
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

**With Computed Property (recommended):**

```html
<div :class="classObject"></div>
```

```javascript
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive,
      'text-danger': this.error !== null
    }
  }
}
```

**Array Syntax:**

```html
<div :class="[activeClass, errorClass]"></div>
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

**Combining Array and Object:**

```html
<div :class="[{ active: isActive }, errorClass]"></div>
```

### Transitions

**Basic Transition:**

```html
<button @click="show = !show">Toggle</button>

<transition name="fade">
  <p v-if="show">Hello</p>
</transition>
```

**CSS Classes:**

```css
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-enter-to {
  opacity: 1;
}

.fade-leave-from {
  opacity: 1;
}
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-leave-to {
  opacity: 0;
}
```

**Transition Classes:**
- `v-enter-from` - Starting state for enter
- `v-enter-active` - Active state for enter (entire entering phase)
- `v-enter-to` - Ending state for enter
- `v-leave-from` - Starting state for leave
- `v-leave-active` - Active state for leave
- `v-leave-to` - Ending state for leave

**Custom Transition Classes:**

```html
<transition
  name="custom"
  enter-active-class="animated fadeIn"
  leave-active-class="animated fadeOut">
  <p v-if="show">Hello</p>
</transition>
```

**JavaScript Hooks:**

```html
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @enter-cancelled="enterCancelled"
  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
  @leave-cancelled="leaveCancelled">
  <p v-if="show">Hello</p>
</transition>
```

### Transition Options and Animating Lists

**Appear Transition (on initial render):**

```html
<transition appear name="fade">
  <div>Initial content</div>
</transition>
```

**Transition Modes:**

```html
<!-- in-out: new element transitions in first, then current element transitions out -->
<transition name="fade" mode="in-out">
  <component :is="view"></component>
</transition>

<!-- out-in: current element transitions out first, then new element transitions in -->
<transition name="fade" mode="out-in">
  <component :is="view"></component>
</transition>
```

**List Transitions with transition-group:**

```html
<transition-group name="list" tag="ul">
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</transition-group>
```

```css
.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.list-enter-active {
  transition: all 0.5s ease;
}
.list-leave-active {
  transition: all 0.5s ease;
  position: absolute;
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-move {
  transition: transform 0.5s;
}
```

**Key Points for Lists:**
- Use `<transition-group>` instead of `<transition>`
- Always specify `:key` on list items
- Renders an actual element (default `<span>`, change with `tag` prop)
- Use `.list-move` class for smooth repositioning of remaining items

---

## Using Components

### Basic Components

**Global Registration:**

```javascript
const app = createApp({});

app.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>
  `
});

app.mount('#app');
```

**Local Registration:**

```javascript
const ComponentA = {
  template: '<div>Component A</div>'
};

createApp({
  components: {
    'component-a': ComponentA
  }
}).mount('#app');
```

**Using Components:**

```html
<div id="app">
  <button-counter></button-counter>
  <component-a></component-a>
</div>
```

**Props (passing data to child components):**

```javascript
app.component('blog-post', {
  props: ['title', 'content', 'author'],
  template: `
    <div class="blog-post">
      <h3>{{ title }}</h3>
      <p>By {{ author }}</p>
      <div>{{ content }}</div>
    </div>
  `
});
```

```html
<blog-post
  title="My Journey with Vue"
  author="John Doe"
  content="Vue.js is amazing!">
</blog-post>
```

**Props Validation:**

```javascript
app.component('user-profile', {
  props: {
    name: String,
    age: [Number, String],
    id: {
      type: Number,
      required: true
    },
    role: {
      type: String,
      default: 'user'
    },
    user: {
      type: Object,
      default() {
        return { name: 'Guest' }
      }
    },
    status: {
      validator(value) {
        return ['active', 'inactive', 'pending'].includes(value);
      }
    }
  }
});
```

### Component Events

**Emitting Events from Child:**

```javascript
app.component('custom-button', {
  template: `
    <button @click="handleClick">
      Click me
    </button>
  `,
  methods: {
    handleClick() {
      this.$emit('custom-click', 'some data');
    }
  }
});
```

**Listening in Parent:**

```html
<custom-button @custom-click="handleCustomClick"></custom-button>
```

```javascript
methods: {
  handleCustomClick(data) {
    console.log('Button clicked with:', data);
  }
}
```

**Defining Emitted Events (recommended):**

```javascript
app.component('custom-form', {
  emits: ['submit', 'cancel'],
  emits: {
    submit(payload) {
      return payload.email && payload.password;
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', { email: this.email, password: this.password });
    }
  }
});
```

**v-model on Components:**

```javascript
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
  `
});
```

```html
<!-- Parent -->
<custom-input v-model="searchText"></custom-input>
```

### Slots

**Basic Slot:**

```javascript
app.component('alert-box', {
  template: `
    <div class="alert">
      <slot></slot>
    </div>
  `
});
```

```html
<alert-box>
  Something bad happened!
</alert-box>
```

**Named Slots:**

```javascript
app.component('base-layout', {
  template: `
    <div class="container">
      <header>
        <slot name="header"></slot>
      </header>
      <main>
        <slot></slot>
      </main>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  `
});
```

```html
<base-layout>
  <template v-slot:header>
    <h1>Page Title</h1>
  </template>

  <!-- Default slot -->
  <p>Main content here</p>

  <template v-slot:footer>
    <p>Footer content</p>
  </template>
</base-layout>

<!-- Shorthand # -->
<base-layout>
  <template #header>
    <h1>Page Title</h1>
  </template>
  <template #footer>
    <p>Footer content</p>
  </template>
</base-layout>
```

**Scoped Slots (passing data to slot):**

```javascript
app.component('todo-list', {
  data() {
    return {
      items: ['Item 1', 'Item 2', 'Item 3']
    }
  },
  template: `
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <slot :item="item" :index="index"></slot>
      </li>
    </ul>
  `
});
```

```html
<todo-list>
  <template v-slot:default="slotProps">
    <span>{{ slotProps.index }}: {{ slotProps.item }}</span>
  </template>
</todo-list>

<!-- Destructuring -->
<todo-list>
  <template #default="{ item, index }">
    <span>{{ index }}: {{ item }}</span>
  </template>
</todo-list>
```

**Default Slot Content:**

```javascript
template: `
  <button>
    <slot>Default Button Text</slot>
  </button>
`
```

---

## Vue CLI and Project Structure

### Application API

**Creating an App:**

```javascript
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
```

**App-level Configuration:**

```javascript
app.config.errorHandler = (err) => {
  console.error('Global error:', err);
};

app.config.globalProperties.$api = apiClient;
```

**Registering Global Components:**

```javascript
import BaseButton from './components/BaseButton.vue';

app.component('BaseButton', BaseButton);
```

**Mounting the App:**

```javascript
app.mount('#app');
```

### Installing with Vue CLI

**Install Vue CLI globally:**

```bash
npm install -g @vue/cli
```

**Create a new project:**

```bash
vue create my-project
```

**Project setup options:**
- Manually select features or use preset
- Choose Vue version (2.x or 3.x)
- Optional features: Router, Vuex, CSS Pre-processors, Linter, Testing

**Start development server:**

```bash
cd my-project
npm run serve
```

**Build for production:**

```bash
npm run build
```

### Vue Project File Structure

```
my-project/
├── node_modules/          # Dependencies
├── public/
│   ├── favicon.ico
│   └── index.html         # Main HTML file
├── src/
│   ├── assets/           # Static assets (images, styles)
│   ├── components/       # Reusable components
│   ├── views/           # Page components (for routing)
│   ├── router/          # Vue Router configuration
│   │   └── index.js
│   ├── store/           # Vuex store (state management)
│   │   └── index.js
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── .gitignore
├── babel.config.js       # Babel configuration
├── package.json          # Dependencies and scripts
└── README.md
```

**main.js (entry point):**

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
```

**App.vue (root component):**

```vue
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Global styles */
</style>
```

**Single File Component (.vue) Structure:**

```vue
<template>
  <div class="component-name">
    <!-- Template markup -->
  </div>
</template>

<script>
export default {
  name: 'ComponentName',
  props: {},
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {}
}
</script>

<style scoped>
/* Component-specific styles */
/* scoped: styles only apply to this component */
</style>
```

---

## Vue Router

### Basic Setup

**Install Vue Router:**

```bash
npm install vue-router@4
```

**Configure Router (router/index.js):**

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
```

**Navigation:**

```html
<!-- Using router-link -->
<router-link to="/">Home</router-link>
<router-link to="/about">About</router-link>

<!-- Named routes -->
<router-link :to="{ name: 'Home' }">Home</router-link>

<!-- Router view (renders matched component) -->
<router-view/>
```

**Programmatic Navigation:**

```javascript
this.$router.push('/about');
this.$router.push({ name: 'About' });
this.$router.push({ path: '/about', query: { id: 123 } });
this.$router.go(-1);
this.$router.replace('/home');
```

**Dynamic Routes:**

```javascript
{
  path: '/user/:id',
  component: User
}
```

**Access route params:**

```javascript
this.$route.params.id

// Or via props
{
  path: '/user/:id',
  component: User,
  props: true
}
```

**Nested Routes:**

```javascript
{
  path: '/user/:id',
  component: User,
  children: [
    {
      path: 'profile',
      component: UserProfile
    },
    {
      path: 'posts',
      component: UserPosts
    }
  ]
}
```

---

## Building a Real Project

### Project Organization Best Practices

**Component Hierarchy:**

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   └── BaseCard.vue
│   ├── layout/           # Layout components
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   └── Sidebar.vue
│   └── features/         # Feature-specific components
│       ├── ProductCard.vue
│       └── ShoppingCart.vue
└── views/               # Page-level components
    ├── Home.vue
    ├── Products.vue
    └── Cart.vue
```

### Converting CodePen to App

**Steps:**
1. Create new Vue CLI project
2. Move HTML from CodePen to template section
3. Move JavaScript to script section
4. Move CSS to style section
5. Convert CDN imports to npm packages
6. Break down monolithic code into components

**Example:**

```vue
<!-- Before (CodePen) -->
<div id="app">
  <h1>{{ title }}</h1>
  <product-list :products="products"></product-list>
</div>

<!-- After (Component) -->
<template>
  <div class="home">
    <h1>{{ title }}</h1>
    <ProductList :products="products"/>
  </div>
</template>

<script>
import ProductList from '@/components/ProductList.vue';

export default {
  name: 'Home',
  components: {
    ProductList
  },
  data() {
    return {
      title: 'My Store',
      products: []
    }
  }
}
</script>
```

### Emitting Updates Across Components

**Child Component:**

```vue
<template>
  <div class="cart-item">
    <p>{{ item.name }}</p>
    <button @click="updateQuantity">Update</button>
  </div>
</template>

<script>
export default {
  props: ['item'],
  emits: ['update-quantity'],
  methods: {
    updateQuantity() {
      this.$emit('update-quantity', {
        id: this.item.id,
        quantity: this.item.quantity + 1
      });
    }
  }
}
</script>
```

**Parent Component:**

```vue
<template>
  <cart-item
    v-for="item in cartItems"
    :key="item.id"
    :item="item"
    @update-quantity="handleUpdateQuantity">
  </cart-item>
</template>

<script>
export default {
  methods: {
    handleUpdateQuantity(payload) {
      const item = this.cartItems.find(i => i.id === payload.id);
      if (item) {
        item.quantity = payload.quantity;
      }
    }
  }
}
</script>
```

### Refactoring Navigation

```vue
<template>
  <nav class="main-nav">
    <router-link
      v-for="link in links"
      :key="link.path"
      :to="link.path"
      class="nav-link">
      {{ link.text }}
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'MainNav',
  data() {
    return {
      links: [
        { path: '/', text: 'Home' },
        { path: '/products', text: 'Products' },
        { path: '/cart', text: 'Cart' }
      ]
    }
  }
}
</script>
```

### Adding Features

**Modifying Cart (Add/Update/Remove):**

```vue
<template>
  <div class="cart">
    <cart-item
      v-for="item in cartItems"
      :key="item.id"
      :item="item"
      @update="updateItem"
      @remove="removeItem">
    </cart-item>
    <p>Total: ${{ cartTotal }}</p>
    <button @click="checkout">Checkout</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: []
    }
  },
  computed: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0).toFixed(2);
    }
  },
  methods: {
    updateItem({ id, quantity }) {
      const item = this.cartItems.find(i => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeItem(id) {
      this.cartItems = this.cartItems.filter(i => i.id !== id);
    },
    checkout() {
      this.$router.push('/checkout');
    }
  }
}
</script>
```
