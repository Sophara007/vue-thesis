<template>
  <div class="admin-page container-fluid">
    <h1>Admin Management</h1>
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
            <th scope="col">Admin Name</th>
            <th scope="col">Email</th>
            <!-- <th scope="col">Password</th> -->
            <th scope="col" style="text-align: center; width: 25%;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(admin, index) in paginatedadminList" :key="admin.id">
            <th>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
            <td>{{ admin.fullname }}</td>
            <td>{{ admin.email }}</td>
            <!-- <td>{{ admin.password }}</td> -->
            <td>
      <div class="wrapper-action" style="text-align: center;">
        <button class="btn btn-primary custom-btn" data-bs-toggle="modal" data-bs-target="#viewModal" @click="openViewModal(admin)">View</button>
        <button class="btn btn-warning custom-btn  mx-2" data-bs-toggle="modal" data-bs-target="#editModal" @click="openEditModal(admin)">Edit</button>
        <button class="btn btn-danger" @click="confirmDeleteAdmin(admin.id)">Delete</button>
      </div>
    </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Only show pagination if there are more than 10 items -->
    <div class="pagination-container" v-if="adminList.length > 10">
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
  </div>

  <!-- Modal -->
<div class="modal fade wrapper-modal" id="createModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" @hidden.bs.modal="resetCreateAdminForm">
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
  <input type="password" class="form-control mb-3" placeholder="Confirm Password" v-model="form.confirmPassword" />
  <div v-if="form.password.length > 0 && form.password.length < 8" class="text-danger">
    Password must be longer than or equal to 8 characters.
  </div>
</div>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="createAdmin">Create</button>
        </div>
      </div>
    </div>
  </div>
<!-- View Modal -->
<div class="modal fade wrapper-modal" id="viewModal" tabindex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="viewModalLabel">View Admin Details</h1>
      </div>
      <div class="modal-body">
        <p><strong>Admin Name:</strong> {{ selectedAdmin.fullname }}</p>
        <p><strong>Email:</strong> {{ selectedAdmin.email }}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>


  <!-- Edit Modal -->
  <div class="modal fade wrapper-modal" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="editModalLabel">Edit Admin Details</h1>
        </div>
        <div class="modal-body">
          <div class="wrapper-form-input">
            <input type="text" class="form-control mb-3" placeholder="Full Name" v-model="selectedAdmin.fullname" />
            <input type="email" class="form-control mb-3" placeholder="Email" v-model="selectedAdmin.email" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="saveEditedAdmin">Save Changes</button>
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
      currentPage: 1,
      itemsPerPage: 10,
      limit: 1000, // Default limit
      page: 1,   // Default page
      form: {
        fullname: "",
        email: "",
        password: "",
         confirmPassword: "", // Add confirmPassword field
      },
      editedAdmin: {
      id: null,
      changes: {},
    },
      selectedAdmin: {  // Initialize selectedAdmin with default values
      fullname: "",  // You should use 'fullName' instead of 'fullname'
      email: "",
    },
    };
  },
  computed: {
    paginatedadminList() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.adminList.slice(startIndex, endIndex);

    },
    totalPages() {
      return Math.ceil(this.adminList.length / this.itemsPerPage);
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
     resetCreateAdminForm() {
    this.form.fullname = "";
    this.form.email = "";
    this.form.password = "";
    this.form.confirmPassword = ""; // Clear the confirmPassword field
  },
   openEditModal(admin) {
  // Create a copy of the admin object
  this.selectedAdmin = { ...admin };
  // Set the editedAdmin to the original admin data
  this.editedAdmin.id = admin.id;
  this.editedAdmin.changes = {};
},

    openViewModal(admin) {
    this.selectedAdmin = admin; // Update the selectedAdmin data
    console.log("Selected Admin:", this.selectedAdmin); // Add this debug statement
  },
    setCurrentPage(page) {
      this.currentPage = page;
    },
    async saveEditedAdmin() {
  try {
    const { id, fullname, email } = this.selectedAdmin; // Destructure admin data
    const updateData = {}; // Create an empty object for updated data

    // Check if email and fullname have been modified
    const originalAdmin = this.adminList.find(admin => admin.id === id);
    if (email !== originalAdmin.email && fullname !== originalAdmin.fullname) {
      // Both email and fullname have been modified, choose one to update
      // In this example, we choose to update email, but you can choose fullname instead
      updateData.email = email;
    } else if (email !== originalAdmin.email) {
      // Only email has been modified
      updateData.email = email;
    } else if (fullname !== originalAdmin.fullname) {
      // Only fullname has been modified
      updateData.fullname = fullname;
    }

    // Check if any fields were modified
    if (Object.keys(updateData).length > 0) {
      const updateResponse = await axios.put(`/admin/update/${id}`, updateData);
      if (updateResponse.status === 200) {
        await this.fetchAdminList();

      

        // Show SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Admin Updated',
          text: 'Admin details have been updated successfully!',
        });
      }
    } else {
      // No fields were modified
      Swal.fire({
        icon: 'info',
        title: 'No Changes',
        text: 'No changes were made to the admin details.',
      });
    }
  } catch (error) {
    console.error("Error updating admin:", error);
    // Show SweetAlert error message
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while updating admin details.',
    });
  }
},
   async createAdmin() {
  try {
    // Check if the password and confirmation password match
    if (this.form.password !== this.form.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password and Confirm Password do not match.',
      });
      return; // Exit the method
    }

    // Proceed with creating the admin if the passwords match
    const createResponse = await axios.post("/admin/create", this.form);
    if (createResponse.status === 201) {
      this.resetCreateAdminForm(); // Reset the form fields
      await this.fetchAdminList();

      Swal.fire({
        icon: 'success',
        title: 'Admin Created',
        text: 'New admin has been created successfully!',
      });
    }
  } catch (error) {
    console.error("Error creating admin:", error);
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
        const response = await axios.get(`/admin?limit=${this.limit}&page=${this.page}`);

        this.adminList = response.data.data.items;
      } catch (error) {
        console.error("Error fetching admin list:", error);
      }
    },
  },
  mounted() {
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
    this.fetchAdminList();
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