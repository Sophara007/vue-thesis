<template>
  <div class="service-page container-fluid">
    <h1>Service Page</h1>
    <div class="wrapper-create m-5">
      <button class="btn btn-success custom-btn" data-bs-toggle="modal" data-bs-target="#createModal">
        Create
      </button>
    </div>
    <div class="wrapper-table">
      <table class="table">
        <thead>
          <tr style="text-align: center">
            <th scope="col" style="width:10% ;">No</th>
            <th scope="col" style="width: 20%;">Title</th>
            <th scope="col" style="width: 30%;">Description</th>
            <th scope="col" style="width: 20%;">Image</th>
            <th scope="col" style="width: 20%;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in paginatedservices" :key="service._id" style="text-align: center">
            <th>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
            <td>{{ service.title }}</td>
            <td><span class="description">{{ service.description }}</span></td>
            <td>
              <img :src="service?.image?.url" class="service-img img-fluid" :alt="service?.image?.alt || 'service'"
                :title="service?.image?.title || service.title" style="margin: auto;" />
              <p>{{ service?.image?.description || "" }}</p>
            </td>
            <td>
              <div class="wrapper-action">
                <button class="btn btn-danger" @click="deleteService(service)">
                  Delete
                </button>
                <button class="btn btn-warning ml-2" @click="openEditModal(service)">
                  Edit
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Only show pagination if there are more than 10 items -->
    <div class="pagination-container" v-if="services.length > 10">
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
  <div class="modal fade wrapper-modal" id="createModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Create Service
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="wrapper-form-input">
            <input type="text" class="form-control" placeholder="Title" v-model="form.title" />
            <textarea class="form-control mt-3" rows="4" placeholder="Description" v-model="form.description"></textarea>
            <div class="input-group mt-3">
              <input ref="fileInput" type="file" class="form-control" v-on:change="onImageChange" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="createServiceAndClearModal" data-bs-dismiss="modal">
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Edit Modal -->
  <div class="modal fade wrapper-modal" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="editModalLabel">Edit Service</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="wrapper-form-input">
            <input type="text" class="form-control" placeholder="Title" v-model="editForm.title" />
            <textarea class="form-control mt-3" rows="4" placeholder="Description"
              v-model="editForm.description"></textarea>
          </div>
          <div class="input-group mt-3">
            <input ref="editFileInput" type="file" class="form-control" @change="onEditImageChange" />
          </div>
        </div>
        <!-- Inside the Edit Modal -->

        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="updateServiceAndClearModal" data-bs-dismiss="modal">
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
export default {
  data() {
    return {
      services: [],
      currentPage: 1,
      itemsPerPage: 10,
      limit: 1000, // Default limit
      page: 1,   // Default page
      form: {
        title: "",
        description: "",
        image: "",
      },
      editForm: {
        id: "",
        title: "",
        description: "",
      },
    };
  },
  computed: {
    paginatedservices() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.services.slice(startIndex, endIndex);

    },
    totalPages() {
      return Math.ceil(this.services.length / this.itemsPerPage);
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
    async getServices() {
      try {
        const response = await axios.get(`/service-company?limit=${this.limit}&page=${this.page}`);
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.items)
        ) {
          this.services = response.data.data.items;
        } else {
          console.error("Invalid API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },
    async deleteService(service) {
      try {
        const result = await Swal.fire({
          title: "Confirm Deletion",
          text: "Are you sure you want to delete this service?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          const deleteResult = await axios.delete(
            `/service-company/${service._id}`
          );
          if (deleteResult.status === 200) {
            this.services = this.services.filter(
              (item) => item._id !== service._id
            );
            Swal.fire({
              // SweetAlert success notification
              icon: "success",
              title: "Service Deleted!",
              text: "The service has been successfully deleted.",
            });
          }
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        Swal.fire({
          // SweetAlert error notification
          icon: "error",
          title: "Delete Failed",
          text: "Failed to delete the service. Please try again.",
        });
      }
    },
    async onImageChange(e) {
      const fileData = e.target.files[0];
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };

      let formData = new FormData();
      formData.append("file", fileData);
      const upload = await axios
        .post("/files/upload", formData, config)
        .then((res) => res.data);
      this.form.image = upload?._id;
    },
    async createService() {
      try {
        const createResponse = await axios.post(
          "/service-company/create",
          this.form
        );
        if (createResponse.status === 201) {
          this.getServices();
          this.form.title = "";
          this.form.description = "";
          this.form.image = "";
        }
      } catch (error) {
        console.error("Error creating service:", error);
      }
    },
    clearFileInput() {
      this.$refs.fileInput.value = ""; // Clear the file input value
    },
    async createServiceAndClearModal() {
      try {
        await this.createService();
        this.clearFileInput();
        Swal.fire({
          // SweetAlert success notification
          icon: "success",
          title: "Service Created!",
          text: "The service has been successfully created.",
        });
      } catch (error) {
        console.error("Error creating service:", error);
        Swal.fire({
          // SweetAlert error notification
          icon: "error",
          title: "Create Failed",
          text: "Failed to create the service. Please try again.",
        });
      }
    },
    async openEditModal(service) {
      this.editForm.id = service._id;
      this.editForm.title = service.title;
      this.editForm.description = service.description;
      $("#editModal").modal("show");
    },
    async updateServiceAndClearModal() {
      try {
        const updateData = {
          title: this.editForm.title,
          description: this.editForm.description,
        };

        if (this.editForm.image) {
          updateData.image = this.editForm.image; // Include image if it's updated
        }

        const updateResponse = await axios.put(
          `/service-company/update/${this.editForm.id}`,
          updateData
        );
        if (updateResponse.status === 200) {
          this.getServices();
          this.editForm.id = "";
          this.editForm.title = "";
          this.editForm.description = "";
          this.editForm.image = ""; // Reset the image field
          $("#editModal").modal("hide");

          Swal.fire({
            // SweetAlert success notification
            icon: "success",
            title: "Service Updated!",
            text: "The service has been successfully updated.",
          });
        }
      } catch (error) {
        console.error("Error updating service:", error);
        Swal.fire({
          // SweetAlert error notification
          icon: "error",
          title: "Update Failed",
          text: "Failed to update the service. Please try again.",
        });
      }
    },

    async onEditImageChange(e) {
      const fileData = e.target.files[0];
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };

      let formData = new FormData();
      formData.append("file", fileData);
      const upload = await axios
        .post("/files/upload", formData, config)
        .then((res) => res.data);
      this.editForm.image = upload?._id;
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
    await this.getServices();
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


.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-page {
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

.service-img {
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
