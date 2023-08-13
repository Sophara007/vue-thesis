<template>
  <div class="users-page">
    <div class="header">
      <h1>Manage Users</h1>
      <p>Perform CRUD operations on users.</p>
    </div>

    <div class="create-user">
      <button @click="toggleCreateForm" class="create-button">Create User</button>
      <transition name="fade">
        <div v-if="showCreateForm" class="create-form-container">
          <form @submit.prevent="handleCreateUser" class="create-form">
            <input v-model="newUser.email" placeholder="Email" required class="input-field" />
            <input v-model="newUser.password" placeholder="Password" type="password" required class="input-field" />
            <button type="submit" class="create-button">Submit</button>
          </form>
        </div>
      </transition>
    </div>

    
      <h2>Users List</h2>
      <ul class="list">
        <li v-for="user in users" :key="user._id" class="user-item">
          <div class="user-info">
            <h3 class="user-email">{{ user.email }}</h3>
            <p class="user-id">ID: {{ user._id }}</p>
          </div>
          <div class="user-actions">
            <button @click="editUser(user._id)" class="edit-button">Edit</button>
            <button @click="deleteUser(user._id)" class="delete-button">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['users']),
  },
  data() {
    return {
      newUser: {
        email: '',
        password: '',
      },
      showCreateForm: false,
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    ...mapActions(['fetchUsers', 'createUser', 'updateUser', 'deleteUser']),

    async handleCreateUser() {
      try {
        await this.createUser(this.newUser);
        this.clearCreateForm();
      } catch (error) {
        console.error('Creating user failed:', error);
      }
    },

    toggleCreateForm() {
      this.showCreateForm = !this.showCreateForm;
    },

    async deleteUser(userId) {
      try {
        await this.deleteUser(userId);
      } catch (error) {
        console.error('Deleting user failed:', error);
      }
    },

    clearCreateForm() {
      this.newUser.email = '';
      this.newUser.password = '';
      this.showCreateForm = false;
    },

    editUser(userId) {
      // Implement the logic to show an edit form and update the user
    },
  },
};
</script>

<style scoped>
/* General Styles */
.users-page {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 1px;
}

/* Header Styles */
.header {
  margin-bottom: 5px;
}

.header h1 {
  font-size: 17px;
  margin: 0;
}

.header p {
  color: #666;
}

/* User List Styles */
.user-list {
  margin-bottom: 10px;
}

.list {
  list-style: none;
  padding: 0;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  transition: background-color 0.3s ease;
}

.user-item:hover {
  background-color: #f0f0f0;
}

.user-info {
  flex: 0.5;
}

.user-list-container {
  max-height: calc(100vh - 230px); /* Adjust the value as needed */
  overflow: auto;
}

.user-email {
  font-size: 14px;
  margin: 0;
  color: #0a0a18;
}

.user-id {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* User Actions Styles */
.user-actions {
  display: flex;
  gap: 10px;
}

.edit-button,
.delete-button {
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.edit-button:hover,
.delete-button:hover {
  background-color: #0056b3;
}

/* Create User Styles */
.create-user {
  border-top: 1px solid #ccc;
  padding-top: 10px; /* Adjusted padding */
  display: flex;
  align-items: center;
}

.create-button {
  border: none;
  padding: 5px 7.5px; /* 50% reduction in padding */
  cursor: pointer;
  background-color: #28a745;
  color: #fff;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.create-button:hover {
  background-color: #3eb45c;
}

.create-form-container {
  margin-left: 10px; /* Adjusted margin */
  display: flex;
  gap: 5px; /* Adjusted gap */
  align-items: flex-end;
}

.input-field {
  padding: 5px; /* 50% reduction in padding */
  border: 1px solid #ccc;
  border-radius: 2px;
  flex: 1;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #3490dc;
}
</style>
