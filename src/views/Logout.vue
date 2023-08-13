<template>
    <div class="logout-container">
      <h2>Logging Out...</h2>
    </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  
  export default {
    name: 'Logout',
    async created() {
      // Call the logout action to perform the logout
      await this.logout();
      
      // After logging out, you might want to redirect the user to the login page
      this.$router.push('/login');
    },
    methods: {
      ...mapActions(['logout']),
    },
  };
  </script>
  
  <style>
  /* Add any necessary styles here */
  </style>
  