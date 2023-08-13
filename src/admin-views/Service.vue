<template>
  <div>
    <h1>Service Company Management</h1>
    
    <button @click="createServiceCompany">Create New</button>

    <ul v-if="serviceCompanies.length">
    <li v-for="company in serviceCompanies" :key="company.id">
      {{ company.name }} - 
      <button @click="editServiceCompany(company)">Edit</button>
      <button @click="viewServiceCompany(company.id)">View</button>
      <button @click="deleteServiceCompany(company.id)">Delete</button>
      {{ console.log(company) }} <!-- Add this line -->
    </li>
  </ul>
    <div v-else>
      <p>No service companies available.</p>
    </div>
    
    <div v-if="showCreateForm">
      <h2>Create New Service Company</h2>
      <form @submit.prevent="submitCreateForm">
        <label for="title">Title:</label>
        <input type="text" v-model="newCompany.title" required>
        
        <label for="description">Description:</label>
        <textarea v-model="newCompany.description" required></textarea>
        
        <button type="submit">Create</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    serviceCompanies() {
      return this.$store.state.serviceCompanies;
    },
  },
  data() {
    return {
      showCreateForm: true,
      newCompany: {
        title: '',
        description: '',
      },
    };
  },
  methods: {
    async fetchServiceCompanies() {
      console.log('Fetching service companies...');
      try {
        await this.$store.dispatch('fetchServiceCompanies');
        console.log('Service companies fetched:', this.serviceCompanies);
      } catch (error) {
        console.error('Error fetching service companies:', error);
      }
    },
    async createServiceCompany() {
      console.log('Creating new service company...');
      this.showCreateForm = true;
    },
    async submitCreateForm() {
      console.log('Submitting create form...');
      try {
        await this.$store.dispatch('createServiceCompany', this.newCompany);
        console.log('Service company created:', this.newCompany);
        this.showCreateForm = false;
        this.newCompany.title = '';
        this.newCompany.description = '';
      } catch (error) {
        console.error('Error creating service company:', error);
      }
    },
    editServiceCompany(company) {
      const id = company.id; // Use the correct property here
      console.log('Editing service company:', id);
      this.$router.push(`/edit-service/${id}`);
    },
    viewServiceCompany(id) {
      console.log('Viewing service company:', id);
      this.$router.push(`/view-service/${id}`);
    },
    async deleteServiceCompany(id) {
      console.log('Deleting service company:', id);
      try {
        await this.$store.dispatch('deleteServiceCompany', id);
      } catch (error) {
        console.error('Error deleting service company:', error);
      }
    },
  },
  created() {
    console.log('Component created.');
    this.fetchServiceCompanies();
  },
};
</script>
