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
    serviceCompanies: [], // Initialize as an empty array
  },
  mutations: {
    setServiceCompanies(state, companies) {
      state.serviceCompanies = companies;
    },
    addServiceCompany(state, company) {
      // Make sure state.serviceCompanies is an array
      if (!Array.isArray(state.serviceCompanies)) {
        state.serviceCompanies = [];
      }
      state.serviceCompanies.push(company);
    },
    updateServiceCompany(state, updatedCompany) {
      const index = state.serviceCompanies.findIndex(company => company.id === updatedCompany.id);
      if (index !== -1) {
        state.serviceCompanies[index] = updatedCompany;
      }
    },
    deleteServiceCompany(state, companyId) {
      state.serviceCompanies = state.serviceCompanies.filter(company => company.id !== companyId);
    },
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
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  
  },
  actions: {

    async fetchServiceCompanies({ commit }) {
      try {
        console.log('Fetching service companies...');
        const response = await axios.get('/service-company?limit=2');
        console.log('Service companies fetched:', response.data);
        commit('setServiceCompanies', response.data);
      } catch (error) {
        console.error('Error fetching service companies:', error);
      }
    },
    async createServiceCompany({ commit }) {
      try {
        console.log('Creating new service company...');
        const response = await axios.post('/service-company/create', {});
        console.log('Service company created:', response.data);
        commit('addServiceCompany', response.data);
      } catch (error) {
        console.error('Error creating service company:', error);
      }
    },
    async updateServiceCompany({ commit }, updatedCompany) {
      try {
        await axios.put(`/service-company/update/${updatedCompany.id}`, updatedCompany);
        commit('updateServiceCompany', updatedCompany);
      } catch (error) {
        // Handle error
      }
    },
    async deleteServiceCompany({ commit }, companyId) {
      try {
        await axios.delete(`/service-company/${companyId}`);
        commit('deleteServiceCompany', companyId);
      } catch (error) {
        // Handle error
      }
    },
    // ... other actions ...
    async login({ commit, dispatch }, { email, password }) {
      commit('setLoading', true);
      commit('clearError');

      try {
        const response = await axios.post('https://seahorse-app-ih22h.ondigitalocean.app/blue-tech-api2/admin/login', {
          email,
          password,
        });

        const { token } = response.data;
        commit('setToken', token);

        localStorage.setItem('token', token);
      } catch (error) {
        commit('setError', error.response.data.error || 'Invalid credentials. Please try again.');
        console.error('Login failed:', error);
      } finally {
        commit('setLoading', false);
      }
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
    getServiceCompanyById: state => id => {
      return state.serviceCompanies.find(company => company.id === id);
    },

  },
});

export default store;