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
            <th>{{index + 1 }}</th>
            <td>{{ user.fullName }}</td>
            <td>
              {{ user.email }}
            </td>
            <td>
              <div class="wrapper-action">
                <button class="btn btn-info">
                  View
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: []
    }
  },
  methods: {
    async getUser() {
      const users = await axios.get('/users?limit=100&sortField=_id').then(res=> res.data.data.items)
      console.log(users)
      this.users = users
    }
  },
  async mounted() {
    await this.getUser();
  },
}

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
