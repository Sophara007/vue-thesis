<template>
  <div class="industry-page container-fluid">
    <h1>Client Detail Page</h1>
    <div class="wrapper-create m-5">
      <button class="btn btn-success custom-btn" data-bs-toggle="modal" data-bs-target="#createModal">
        Create
      </button>
    </div>
    <div class="wrapper-table">
      <table class="table">
        <thead>
          <tr style="text-align: center;">
            <th scope="col" style="width: 5%;">No</th>
            <th scope="col" style="width: 20%;">Client</th>
            <th scope="col" style="width: 20%;">Title</th>
            <th scope="col" style="width: 20%;">Description</th>
            <th scope="col" style="width: 20%;">Image</th>
            <th scope="col" style="width: 20%;">Actions</th>
          </tr>
        </thead>
        <tbody>
        <tr v-for="(industry, index) in paginatedindustryDetails" :key="industry._id" style="text-align: center;">
          <th>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
          <td><span class="description">{{ getIndustryTitleById(industry.industry) }}</span></td>
          <td><span class="description">{{ industry.title }}</span></td>
          <td><span class="description">{{ industry.description }}</span></td>
          <td>
            <img :src="industry?.image?.url" class="industry-img img-fluid" alt="industry" style="margin: auto;" />
          </td>
          <td>
            <div class="wrapper-action">
              <button class="btn btn-danger" @click="deleteIndustry(industry)">
                Delete
              </button>
              <button class="btn btn-warning ml-2" @click="openEditModal(industry)">Edit</button>
            </div>
          </td>
        </tr>
      </tbody>
      </table>
    </div>
    <!-- Only show pagination if there are more than 10 items -->
    <div class="pagination-container" v-if="industryDetails.length > 10">
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


  <!-- Modal create -->
  <div class="modal fade wrapper-modal" id="createModal" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Create Industry Detail</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="wrapper-form-input">
            <input type="text" class="form-control" placeholder="Title" v-model="form.title" />
            <textarea class="form-control mt-3" rows="4" placeholder="Description" v-model="form.description"></textarea>
            <div class="input-group mt-3">
              <input ref="fileInput" type="file" class="form-control" v-on:change="onImageChange" />
            </div>

            <div class="input-group mt-3">
  <select class="form-select" v-model="form.industry" aria-label="Default select example">
    <option value="" disabled selected>Select an Industry</option> <!-- Placeholder option -->
    <option v-for="item in listSelect" :key="item._id" :value="item._id">{{ item.title }}</option>
  </select>
</div>

          

          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="createIndustryDetailAndClearModal" data-bs-dismiss="modal">
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
          <h1 class="modal-title fs-5" id="editModalLabel">Edit Industry Detail</h1>
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
          <button type="button" class="btn btn-success" @click="updateIndustryAndClearModal" data-bs-dismiss="modal">
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>

import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      industryDetails: [],
      listSelect: [],
      currentPage: 1,
      itemsPerPage: 10,
      limit: 1000, // Default limit
      page: 1,   // Default page
      file: "",
      form: {
        title: "",
        description: "", // Add description field
        image: "",
        industry: ""
      },
      editForm: {
        id: "", // Store the ID of the industry being edited
        title: "",
        description: "",
      },
    };
  },
  computed: {
    paginatedindustryDetails() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.industryDetails.slice(startIndex, endIndex);

    },
    totalPages() {
      return Math.ceil(this.industryDetails.length / this.itemsPerPage);
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
    getIndustryTitleById(industryId) {
      const industry = this.listSelect.find(item => item._id === industryId);
      return industry ? industry.title : '';
    },
    async onEditImageChange(e) {
      const fileData = e.target.files[0];
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };

      let formData = new FormData();
      formData.append("file", fileData);
      const upload = await axios.post("/files/upload", formData, config).then((res) => res.data);
      this.editForm.image = upload?._id;
    },

    async listIndustries() {
  const data = await axios.get(`/industry?limit=${this.limit}&page=${this.page}`)
    .then(res => res.data.data.items);
  console.log(data);
  this.listSelect = data;
},


    openEditModal(industry) {
      this.editForm.id = industry._id;
      this.editForm.title = industry.title;
      this.editForm.description = industry.description;
      $("#editModal").modal("show"); // Use jQuery to open the modal
    },
    async updateIndustryAndClearModal() {
  try {
    const updateData = {
      title: this.editForm.title,
      description: this.editForm.description,
    };

    if (this.editForm.image) {
      updateData.image = this.editForm.image;
    }

    const updateResponse = await axios.put(`/industry/detail/${this.editForm.id}`, updateData);
    if (updateResponse.status === 200) {
      await this.getIndustryDetail(); // Fetch updated industry details
      this.editForm.id = "";
      this.editForm.title = "";
      this.editForm.description = "";
      this.editForm.image = "";
      $("#editModal").modal("hide");
      Swal.fire({
        icon: "success",
        title: "Industry Detail Updated!",
        text: "The industry detail has been successfully updated.",
      });
    }
  } catch (error) {
    console.error("Error updating industry detail:", error);
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "Failed to update the industry detail. Please try again.",
    });
  }
},


    async getIndustryDetail() {

      try {
        const response = await axios.get(`/industry/detail?limit=${this.limit}&page=${this.page}`);


        if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
          const industryDetails = response.data.data.items;

          this.industryDetails = industryDetails;
        } else {
          console.error("Invalid API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching industries:", error);
      }
    },
    async deleteIndustry(industry) {
  try {
    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this industry detail?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const deleteResult = await axios.delete(`/industry/detail/${industry._id}`);
      if (deleteResult.status === 200) {
        this.industryDetails = this.industryDetails.filter(item => item._id !== industry._id); // Corrected line
        Swal.fire({
          icon: "success",
          title: "Industry Deleted!",
          text: "The industry detail has been successfully deleted.",
        });
      }
    }
  } catch (error) {
    console.error("Error deleting industry detail:", error);
    Swal.fire({
      icon: "error",
      title: "Delete Failed",
      text: "Failed to delete the industry detail. Please try again.",
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
    async createIndustryDetail() {
      try {
        const createResponse = await axios.post("/industry/detail", this.form);

        if (createResponse.status === 201) {
          this.getIndustryDetail()
          this.form.title = "";
          this.form.description = ""; // Clear description field
          this.form.image = "";
          this.showModal = false;
        }
      } catch (error) {
        console.error("Error creating industry detail:", error);
      }
    },
    clearFileInput() {
      this.$refs.fileInput.value = '';
      this.$refs.editFileInput.value = ''; // Clear the edit file input value
    },

    async createIndustryDetailAndClearModal() {
      try {
        await this.createIndustryDetail();
        this.clearFileInput();
        Swal.fire({
          icon: "success",
          title: "Industry Detail Created!",
          text: "The industry detail has been successfully created.",
        });

      } catch (error) {
        console.error("Error creating industry detail:", error);
        Swal.fire({
          icon: "error",
          title: "Create Failed",
          text: "Failed to create the industry detail. Please try again.",
        });
      }
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
    console.log("Component mounted. Fetching industry details..."); // Add this log
    await this.getIndustryDetail();
    await this.listIndustries()
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

.industry-page {
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

.industry-img {
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
  