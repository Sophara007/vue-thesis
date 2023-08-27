<template>
  <div class="users-page container-fluid">
    <h1>Customer</h1>
    <div class="wrapper-table mt-5">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">N0</th>
            <th scope="col">Full Name</th>
            <th scope="col">Email</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.id">
            <th>{{ index + 1 }}</th>
            <td>{{ user.fullName }}</td>
            <td>{{ user.email }}</td>
            <td>
              <div class="wrapper-action">
                <button class="btn btn-info" @click="viewUserDetails(user)">
                  View
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- User Details Modal -->
    <div class="modal" tabindex="-1" role="dialog" v-if="selectedUser">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedUser.fullName }} Details</h5>
            <button type="button" class="close" aria-label="Close" @click="closeUserDetails">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p><strong>Email:</strong> {{ selectedUser.email }}</p>
            <!-- Add more user details here -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeUserDetails">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [],
      selectedUser: null
    };
  },
  methods: {
    async getUser() {
      const users = await axios.get('/users?limit=100&sortField=_id').then(res => res.data.data.items);
      this.users = users;
    },
    viewUserDetails(user) {
    console.log("View button clicked:", user);
    this.selectedUser = user;
  },
    closeUserDetails() {
      this.selectedUser = null;
    }
  },
  async mounted() {
    await this.getUser();
  }
};
</script>

<style lang="scss" scoped>
.users-page {
  h1 {
    font-size: 24px;
    font-weight: bold;
    text-transform: uppercase;
  }
}
</style>
