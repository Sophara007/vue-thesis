<template>
  <div class="users-page container-fluid">
    <h1>Customer</h1>
    <div class="wrapper-table mt-5">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Full Name</th>
            <th scope="col">Email</th>
            <th scope="col">Ballance</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.id">
            <th>{{ index + 1 }}</th>
            <td>{{ user.fullName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.ballance }} $</td>
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
    <div
      class="modal fade"
      id="userDetailsModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="userDetailsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="userDetailsModalLabel">
              {{ selectedUser ? selectedUser.fullName + " Details" : "" }}
            </h5>
          </div>
          <div class="modal-body">
            <div v-if="selectedUser">
              <strong>Full Name:</strong> {{ selectedUser.fullName }} <br>
              <strong>Email:</strong> {{ selectedUser.email }} <br>    
              <strong>Ballance:</strong> {{ selectedUser.ballance }} $         
            </div>
            <!-- Add more user details here -->
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
      selectedUser: null,
    };
  },
  methods: {
    async getUser() {
      const users = await axios
        .get("/users?limit=1000")
        .then((res) => res.data.data.items);
      this.users = users;
    },
    viewUserDetails(user) {
      this.selectedUser = user;
      // Trigger the Bootstrap modal to show
      $("#userDetailsModal").modal("show");
    },
  },
  async mounted() {
    await this.getUser();
  },
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
