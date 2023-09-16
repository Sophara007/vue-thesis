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
          <tr v-for="(user, index) in paginatedusers" :key="user.id" >
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
    <!-- Only show pagination if there are more than 10 items -->
    <div class="pagination-container" v-if="users.length > 10">
      <ul class="pagination">
        <li class="page-item">
          <button class="page-link" @click="currentPage -= 1" :disabled="currentPage === 1">
            &#8592; Previous
          </button>
        </li>

        <li v-for="page in visiblePages" :key="page">
          <button class="page-link" @click="currentPage = page" :class="{ 'active': currentPage === page }">
            {{ page }}
          </button>
        </li>
        <li class="page-item">
          <button class="page-link" @click="currentPage += 1" :disabled="currentPage === totalPages">
            Next &#8594;
          </button>
        </li>

      </ul>
    </div>

    <!-- User Details Modal -->
    <div class="modal fade" id="userDetailsModal" tabindex="-1" role="dialog" aria-labelledby="userDetailsModalLabel"
      aria-hidden="true">
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
          <div class="modal-footer">
          <button type="button" class="btn btn-secondary bg-red-500 hover:bg-red-600 text-white" data-bs-dismiss="modal"
            @click="closeViewModal">Close</button>
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
      currentPage: 1,
      itemsPerPage: 10,
      limit: 1000, // Default limit
      page: 1,   // Default page
    };
  },
  computed: {
    paginatedusers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.users.slice(startIndex, endIndex); // Updated to use 'users' data
    },
    totalPages() {
      return Math.ceil(this.users.length / this.itemsPerPage); // Updated to use 'users' data
    },
    visiblePages() {
      const maxVisiblePages = 5; // Adjust this value as needed
      const pages = [];

      if (this.totalPages <= maxVisiblePages) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (this.currentPage <= maxVisiblePages - 2) {
          for (let i = 1; i <= maxVisiblePages - 2; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(this.totalPages - 1);
          pages.push(this.totalPages);
        } else if (this.currentPage >= this.totalPages - maxVisiblePages + 3) {
          pages.push(1);
          pages.push(2);
          pages.push("...");
          for (let i = this.totalPages - maxVisiblePages + 3; i <= this.totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push(2);
          pages.push("...");
          for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(this.totalPages - 1);
          pages.push(this.totalPages);
        }
      }

      return pages;
    },
  },
  methods: {
    setCurrentPage(page) {
      this.currentPage = page;
    },
    async getUser() {
      const users = await axios
        .get(`/users?limit=${this.limit}&page=${this.page}`) // Updated URL
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
    const urlParams = new URLSearchParams(window.location.search);
    const limitParam = urlParams.get('limit');
    const pageParam = urlParams.get('page');

    // Update limit and page with query parameter values if provided
    if (limitParam) {
      this.limit = parseInt(limitParam);
    }
    if (pageParam) {
      this.page = parseInt(pageParam);
    }
    await this.getUser();
    
  },
};
</script>

<style lang="scss" scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination {
  display: flex;
  list-style: none;
  padding: 0;
}

.page-item {
  margin: 0;
}

.page-link {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  color: #333;
  text-decoration: none;
  cursor: pointer;
}

.page-link.active {
  background-color: #007bff;
  color: #fff;
}

.page-link:hover {
  background-color: #e9e9e9;
}

.page-link:disabled {
  background-color: #ddd;
  color: #999;
  cursor: not-allowed;
}

.page-link:focus {
  outline: none;
  box-shadow: none;
}
.users-page {
  h1 {
    font-size: 24px;
    font-weight: bold;
    text-transform: uppercase;
  }
}
</style>
