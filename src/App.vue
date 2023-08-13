<template>
  <div>
    <navbar></navbar>
    <router-view />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  components: {
    Navbar,
  },
};
</script>

<style>
/* Global styles for the entire app */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

nav {
  background-color: #007bff;
  padding: 10px;
  color: white;
}

nav ul {
  list-style-type: none;
  display: flex;
  justify-content: flex-end;
  margin: 0;
  padding: 0;
}

nav li {
  margin-right: 20px;
}

nav a {
  text-decoration: none;
  color: white;
}

.navbar-brand {
  font-weight: bold;
}
</style>
