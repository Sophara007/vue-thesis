<template>
  <div class="login-page container-fluid p-0">
    <div class="row">
      <div class="left-side col-md-6">
        <div class="wrapper-logo"></div>
      </div>
      <div class="right-side col-md-6">
        <div class="wrapper-login">
          <div class="login-container">
            <div class="login-box">
              <h2 class="login-title">Welcome Back!</h2>
              <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                  <label for="email">Email:</label>
                  <input
                    v-model="email"
                    type="email"
                    id="email"
                    required
                    placeholder="Enter your email"
                  />
                </div>
                <div class="form-group">
                  <label for="password">Password:</label>
                  <div class="password-input">
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      required
                      placeholder="Enter your password"
                    />
                    <span
                      class="toggle-password"
                      @click="togglePasswordVisibility"
                    >
                      <i
                        :class="
                          showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'
                        "
                      ></i>
                    </span>
                  </div>
                </div>
                <button
                  :disabled="isLoading"
                  type="submit"
                  class="login-button"
                >
                  <span v-if="isLoading"
                    ><i class="fas fa-spinner fa-spin"></i> Logging In...</span
                  >
                  <span v-else>Login</span>
                </button>
                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
              </form>
              <div class="signup-link d-none">
                Don't have an account?
                <router-link to="/signup">Sign Up</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  


<script>
import { mapActions } from 'vuex';

export default {
  name: "Home",
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
    async handleLogin() {
      this.errorMessage = '';
      this.isLoading = true;

      try {
        await this.login({
          email: this.email,
          password: this.password,
        });

        if (this.$store.getters.isAuthenticated) {
          this.$router.push('/admin');
          this.$router.removeRoute('/login');
        } else {
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      } catch (error) {
        if (error.response?.data?.message && error.response.data.message.length > 5) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'An error occurred during login. Please try again later.';
        }
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    ...mapActions(['login']),
  },
};
</script>
  
  <style lang="scss" scoped>
.login-page {
  .left-side {
    height: 100vh;
    background-image: url("../assets/logo.webp");
    background-repeat: no-repeat;
    background-position: center;
  }
  .right-side {
    /* Styles for the login form */
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f2f2f2;
    }

    .login-box {
      max-width: 400px;
      padding: 30px;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .login-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: center;
    }

    .login-form {
      display: flex;
      flex-direction: column;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      font-weight: bold;
      font-size: 16px;
      display: block; /* Add display block to make the label stay on top */
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

    .login-button {
      background-color: #007bff;
      color: #fff;
      padding: 12px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .login-button:hover {
      background-color: #0056b3;
    }

    .error {
      color: red;
      font-size: 14px;
      text-align: center;
      margin-top: 10px;
    }

    .signup-link {
      margin-top: 20px;
      text-align: center;
      font-size: 16px;
    }

    .signup-link a {
      color: #007bff;
      text-decoration: none;
      font-weight: bold;
    }

    .signup-link a:hover {
      text-decoration: underline;
    }
  }
}
</style>
  