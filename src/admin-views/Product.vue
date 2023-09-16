<template>
  <div class="product-page container-fluid">
    <h1>Product Page</h1>
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
            <th scope="col" style="width: 20%;">Title</th>
            <th scope="col" style="width: 20%;">Description</th>
            <th scope="col" style="width: 20%;">Image</th>
            <th scope="col" style="width: 20%;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in paginatedproducts" :key="product._id" style="text-align: center;">
            <th>{{ index + 1 }}</th>
            <td><span class="description">{{ product.title }}</span></td>
            <td><span class="description">{{ product.description }}</span></td>
            <td>
              <img :src="product?.logo?.url" class="product-img img-fluid" :alt="product?.logo?.alt || 'product'"
                :title="product?.logo?.title || product.title" style="margin: auto;"/>
              <p>{{ product?.logo?.description || '' }}</p>
            </td>
            <td>
              <div class="wrapper-action">
                <button class="btn btn-danger" @click="deleteProduct(product)">
                  Delete
                </button>
                <button class="btn btn-warning ml-2" @click="openEditModal(product)">Edit</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Only show pagination if there are more than 10 items -->
    <div class="pagination-container" v-if="products.length > 10">
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
          <h1 class="modal-title fs-5" id="exampleModalLabel">Create Product</h1>
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
          <button type="button" class="btn btn-success" @click="createProductAndClearModal" data-bs-dismiss="modal">
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
          <h1 class="modal-title fs-5" id="editModalLabel">Edit Product</h1>
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
          <button type="button" class="btn btn-success" @click="updateProductAndClearModal" data-bs-dismiss="modal">
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
      products: [],
      currentPage: 1,
      itemsPerPage: 10,
      limit: 1000, // Default limit
      page: 1,   // Default page
      form: {
        title: "",
        description: "",
        logo: "",
      },
      editForm: {
        id: "",
        title: "",
        description: "",
      },
    };
  },
  computed: {
    paginatedproducts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.products.slice(startIndex, endIndex);

    },
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
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
    async getProducts() {
      try {
        const response = await axios.get(`/product?limit=${this.limit}&page=${this.page}`);
        if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
          this.products = response.data.data.items;
        } else {
          console.error("Invalid API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },

    async deleteProduct(product) {
      try {
        const result = await Swal.fire({
          title: "Confirm Deletion",
          text: "Are you sure you want to delete this product?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          const deleteResult = await axios.delete(`/product/${product._id}`);
          if (deleteResult.status === 200) {
            this.products = this.products.filter((item) => item._id !== product._id);
            Swal.fire({
              icon: "success",
              title: "Product Deleted!",
              text: "The product has been successfully deleted.",
            });
          }
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Failed to delete the product. Please try again.",
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
      const upload = await axios.post("/files/upload", formData, config).then((res) => res.data);
      this.form.logo = upload?._id;
    },

    async createProduct() {
      try {
        const createResponse = await axios.post("/product/create", this.form);
        if (createResponse.status === 201) {
          this.getProducts();
          this.form.title = "";
          this.form.description = "";
          this.form.logo = "";
        }
      } catch (error) {
        console.error("Error creating product:", error);
      }
    },

    clearFileInput() {
      this.$refs.fileInput.value = "";
    },

    async createProductAndClearModal() {
      try {
        await this.createProduct();
        this.clearFileInput();
        Swal.fire({
          icon: "success",
          title: "Product Created!",
          text: "The product has been successfully created.",
        });
      } catch (error) {
        console.error("Error creating product:", error);
        Swal.fire({
          icon: "error",
          title: "Create Failed",
          text: "Failed to create the product. Please try again.",
        });
      }
    },

    async openEditModal(product) {
      this.editForm.id = product._id;
      this.editForm.title = product.title;
      this.editForm.description = product.description;
      $("#editModal").modal("show");
    },

    async updateProductAndClearModal() {
      try {
        const updateData = {
          title: this.editForm.title,
          description: this.editForm.description,
        };

        if (this.editForm.logo) {
          updateData.logo = this.editForm.logo;
        }

        const updateResponse = await axios.put(`/product/update/${this.editForm.id}`, updateData);
        if (updateResponse.status === 200) {
          this.getProducts();
          this.editForm.id = "";
          this.editForm.title = "";
          this.editForm.description = "";
          this.editForm.logo = "";
          $("#editModal").modal("hide");

          Swal.fire({
            icon: "success",
            title: "Product Updated!",
            text: "The product has been successfully updated.",
          });
        }
      } catch (error) {
        console.error("Error updating product:", error);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update the product. Please try again.",
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
      const upload = await axios.post("/files/upload", formData, config).then((res) => res.data);
      this.editForm.logo = upload?._id;
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
    await this.getProducts();
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
.product-page {
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

.product-img {
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

