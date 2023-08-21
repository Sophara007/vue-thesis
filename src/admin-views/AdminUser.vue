<template>
  <div class="admin-page container-fluid">
    <h1>Create Admin Page</h1>
    <div class="wrapper-create m-5">
      <button class="btn btn-success custom-btn" data-bs-toggle="modal" data-bs-target="#createModal">
        Create
      </button>
    </div>
    <div class="wrapper-table">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Password</th>
            <th scope="col" style="text-align: center;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(admin, index) in adminList" :key="admin.id">
            <th>{{ index + 1 }}</th>
            <td>{{ admin.fullname }}</td>
            <td>{{ admin.email }}</td>
            <td>{{ admin.password }}</td>
            <td>
      <div class="wrapper-action" style="text-align: center;">
        <button class="btn btn-danger" @click="confirmDeleteAdmin(admin.id)">Delete</button>
      </div>
    </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade wrapper-modal" id="createModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Create Admin</h1>
        </div>
        <div class="modal-body">
          <div class="wrapper-form-input">
            <input type="text" class="form-control mb-3" placeholder="Full Name" v-model="form.fullname" />
            <input type="email" class="form-control mb-3" placeholder="Email" v-model="form.email" />
            <input type="password" class="form-control mb-3" placeholder="Password" v-model="form.password" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="createAdmin">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      adminList: [],
      form: {
        fullname: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async createAdmin() {
      try {
        const createResponse = await axios.post("/admin/create", this.form);
        if (createResponse.status === 201) {
          this.form.fullname = "";
          this.form.email = "";
          this.form.password = "";

          await this.fetchAdminList();

          // Show SweetAlert success message
          Swal.fire({
            icon: 'success',
            title: 'Admin Created',
            text: 'New admin has been created successfully!',
          });
        }
      } catch (error) {
        console.error("Error creating admin:", error);
        // Show SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while creating admin.',
        });
      }
    },
    async confirmDeleteAdmin(adminId) {
      try {
        const confirmResult = await Swal.fire({
          icon: 'warning',
          title: 'Confirm Deletion',
          text: 'Are you sure you want to delete this admin?',
          showCancelButton: true,
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#d33',
        });

        if (confirmResult.isConfirmed) {
          const deleteResponse = await axios.delete(`/admin/delete/${adminId}`);
          if (deleteResponse.status === 200) {
            await this.fetchAdminList();
            Swal.fire({
              icon: 'success',
              title: 'Admin Deleted',
              text: 'Admin has been deleted successfully!',
            });
          }
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while deleting admin.',
        });
      }
    },

    async fetchAdminList() {
      try {
        const response = await axios.get("/admin");
        this.adminList = response.data.data.items;
      } catch (error) {
        console.error("Error fetching admin list:", error);
      }
    },
  },
  mounted() {
    this.fetchAdminList();
  },
};
</script>

<style lang="scss" scoped>
  
  .admin-page {
    h1 {
      font-size: 24px;
      font-weight: bold;
      text-transform: uppercase;
    }
  
    .wrapper-create {
      display: flex;
      justify-content: flex-end;
    }
  }
  
  .admin-img {
    width: 200px;
    height: 100px;
    object-fit: contain;
  }
  
  .wrapper-modal {
    .modal-footer {
      .btn {
        color: green;
  
        &:hover {
          color: white;
        }
      }
    }
  }
  </style>