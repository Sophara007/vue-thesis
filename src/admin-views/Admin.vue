<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Admin Profile</h1>
    <div v-if="isLoading">
      <p class="text-center">Loading...</p>
    </div>
    <div v-else-if="error">
      <div class="text-center">
        <p>Error loading user details.</p>
        <p>Error message: {{ error.message }}</p>
      </div>
    </div>
    <div v-else>
      <div v-if="userDetails.fullname && userDetails.email">
        <p><strong>Full Name:</strong> {{ userDetails.fullname }}</p>
        <p><strong>Email:</strong> {{ userDetails.email }}</p>
      </div>
      <div v-else>
        <p>User details are not available.</p>
      </div>
      <div class="mt-4">
        <label class="block font-semibold">Current Password</label>
        <div class="relative flex items-center">
          <input v-model="currentPassword" :type="currentPasswordVisible ? 'text' : 'password'" class="w-70 p-2 border rounded">
          <button @click="toggleCurrentPasswordVisibility" class="ml-2">
            <i :class="['far', currentPasswordVisible ? 'fa-eye' : 'fa-eye-slash'  ]"></i>
          </button>
        </div>
      </div>
      <div class="mt-4">
        <label class="block font-semibold">New Password</label>
        <div class="relative flex items-center">
          <input v-model="newPassword" :type="newPasswordVisible ? 'text' : 'password'" class="w-70 p-2 border rounded">
          <button @click="toggleNewPasswordVisibility" class="ml-2">
            <i :class="['far', newPasswordVisible ?  'fa-eye' : 'fa-eye-slash' ]"></i>
          </button>
        </div>
      </div>
      <div class="mt-4">
        <label class="block font-semibold">Confirm Password</label>
        <div class="relative flex items-center">
          <input v-model="confirmPassword" :type="confirmPasswordVisible ? 'text' : 'password'" class="w-70 p-2 border rounded">
          <button @click="toggleConfirmPasswordVisibility" class="ml-2">
            <i :class="['far', confirmPasswordVisible ?  'fa-eye' : 'fa-eye-slash' ]"></i>
          </button>
        </div>
      </div>
      <button @click="updatePassword" class="mt-4 bg-blue-500 text-white p-2 rounded">Update Password</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert
export default {
  data() {
    return {
      accessToken: localStorage.getItem('token'),
      userDetails: {
        fullname: '',
        email: ''
      },
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      currentPasswordVisible: false,
      newPasswordVisible: false,
      confirmPasswordVisible: false,
      isLoading: true,
      error: null,
    };
  },
  methods: {
    fetchUserDetails() {
      const userDetailsEndpoint = '/admin/profile';
      const config = {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      };
      axios.get(userDetailsEndpoint, config)
        .then(response => {
          this.userDetails = response.data.data.user;
          this.isLoading = false;
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          this.isLoading = false;
          this.error = error;
        });
    },
    updatePassword() {
      const updatePasswordEndpoint = '/admin/resetProfilePassword';
      const config = {
        headers: {
          Authorization: `Bearer ${this.accessToken}`
        }
      };
      const data = {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword
      };
      axios
        .put(updatePasswordEndpoint, data, config)
        .then(response => {
          console.log('Password update response:', response.data);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Password updated successfully.',
            timer: 1500,
  showConfirmButton: false
          });
          // Clear input fields
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        })
        .catch(error => {
          console.error('Error updating password:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred. Please check your input and try again.',
            timer: 1500,
  showConfirmButton: false
          });
        });
    },
    toggleCurrentPasswordVisibility() {
      this.currentPasswordVisible = !this.currentPasswordVisible;
    },
    toggleNewPasswordVisibility() {
      this.newPasswordVisible = !this.newPasswordVisible;
    },
    toggleConfirmPasswordVisibility() {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  },
  created() {
    this.fetchUserDetails();
  }
};
</script>

<style scoped>
/* Your styles */
</style>
