<template>
    <!-- The signup form container -->
    <div class="signup-container">
      <!-- The signup box with the actual form -->
      <div class="signup-box">
        <!-- Signup form title -->
        <h2 class="signup-title">Create an Admin Account</h2>
        <!-- Signup form with event handler on submit -->
        <form @submit.prevent="signup" class="signup-form">
          <!-- Email input field -->
          <div class="form-group">
            <label for="email">Email:</label>
         <!-- Signup form title -->
       
                <input v-model="email" type="email" id="email" required placeholder="Enter your email" />
          </div>
  
          <!-- Password input field -->
          <div class="form-group">
            <label for="password">Password:</label>
            <div class="password-input">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password" required placeholder="Enter your password" />
              <!-- Password visibility toggle with eye icon -->
              <span class="toggle-password" @click="togglePasswordVisibility">
                <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </span>
            </div>
          </div>
  
          <!-- Signup button with loading state -->
          <button :disabled="isLoading" type="submit" class="signup-button">
            <span v-if="isLoading"><i class="fas fa-spinner fa-spin"></i> Signing Up...</span>
            <span v-else>Sign Up</span>
          </button>
  
          <!-- Display error message if signup fails -->
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        errorMessage: '',
        showPassword: false,
        isLoading: false,
      };
    },
    methods: {
      async signup() {
        try {
          // Show loading state on signup button
          this.isLoading = true;
  
          // Make API request to backend signup route using globally available Axios instance
          const response = await this.$axios.post('/signup', {
            email: this.email,
            password: this.password,
          });
  
          // Check if signup was successful (status code 201 or 200)
          if (response.status === 201 || response.status === 200) {
            // Clear the form fields after successful signup
            this.email = '';
            this.password = '';
            this.errorMessage = '';
  
            // Redirect the user to the login page after successful signup
            this.$router.push('/login');
          } else {
            // If signup was not successful, handle the error
            this.errorMessage = 'An error occurred during signup. Please try again.';
          }
        } catch (error) {
          // Handle specific error cases
          if (error.response && error.response.status === 409) {
            this.errorMessage = 'Email is already in use. Please use a different email.';
          } else {
            this.errorMessage = 'An error occurred during signup. Please try again.';
          }
          console.error(error);
        } finally {
          // Hide loading state on signup button
          this.isLoading = false;
        }
      },
      togglePasswordVisibility() {
        // Toggle password visibility
        this.showPassword = !this.showPassword;
      },
    },
  };
  </script>
  
  
  <style scoped>
  /* Styles for the signup form */
  .signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f2f2f2;
  }
  
  .signup-box {
    max-width: 400px;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .signup-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .signup-form {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    font-weight: bold;
    font-size: 16px;
    display: block; /* Make the label stay on top */
    margin-bottom: 5px;
  }
  
  input {
    padding: 12px 12px 12px 40px; /* Adjust the padding to give space for the eye icon */
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
    font-size: 16px;
  }
  
  .password-input {
    position: relative;
    margin-top: 10px; /* Add margin-top to separate email and password inputs */
  }
  
  .toggle-password {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }
  
  .signup-button {
    background-color: #007bff;
    color: #fff;
    padding: 12px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .signup-button:hover {
    background-color: #0056b3;
  }
  
  .error {
    color: red;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }
  </style>
  