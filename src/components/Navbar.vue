<template>
  <nav class="navbar" v-if="!$route.meta.hideNavbar">
    <div class="container">
      <router-link to="/" class="navbar-brand">Blue-Tech</router-link>
      <ul class="navbar-links">

      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  // Your script code if any...
}
</script>

<style scoped>
/* Scoped styles specific to the Navbar.vue component */
nav {
  background-color: #007bff;
  padding: 10px;
  color: white;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
}

.container {
  display: inline-block;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
}

.navbar-brand {
  font-weight: bold;
  text-decoration: none;
  color: white;
}

.navbar-links {
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.navbar-links li {
  margin-right: 20px;
}

.navbar-links a {
  text-decoration: none;
  color: white;
}

/* Additional styles to ensure content area is not covered */
main {
  padding-top: 60px; /* Adjust this value to set the padding according to the navbar height */
}
</style>
