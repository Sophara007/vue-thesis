import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    users: [], // Add this property to store users' data
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    isAuthenticated: false,
  
  },
  mutations: {
 
    setUsers(state, users) {
      state.users = users;
    },
  
    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = true;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    },
    clearToken(state) {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  
  },
  actions: {

    
   
   
    // ... other actions ...
    async login({ commit, dispatch }, { email, password }) {
      commit('setLoading', true);
      commit('clearError');

      try {
        const response = await axios.post('https://seahorse-app-ih22h.ondigitalocean.app/blue-tech-api2/admin/login', {
          email,
          password,
        });
      
        const { access_token } = response.data; // Extract access_token from response
        console.log('Received Token:', access_token); // Add this line to check the received token
        commit('setToken', access_token); // Use access_token to set the token
      
        localStorage.setItem('token', access_token);
      } catch (error) {
        commit('setError', error.response.data.error || 'Invalid credentials. Please try again.');
        console.error('Login failed:', error);
      } finally {
        commit('setLoading', false);
      }
    },
    async logout({ commit }) {
      // You can include any necessary logout-related logic here
      
      // Call the clearToken mutation to remove the token from the store
      commit('clearToken');
    },
  },
  getters: {
    // ... other getters as needed ...
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    currentUser(state) {
      return state.user;
    },
   

  },
});

export default store;