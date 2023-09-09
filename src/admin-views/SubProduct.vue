<template>
  <div class="SubProduct-page container-fluid">
    <h1>Sub Product Page</h1>
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
            <th scope="col" style="width: 20%;">Sub Product of</th>
            <th scope="col" style="width: 20%;">Price</th>
            <th scope="col" style="width: 20%;">Title</th>
            <th scope="col" style="width: 20%;">Description</th>
            <th scope="col" style="width: 20%;">Image</th>
            <th scope="col" style="width: 20%;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(SubProduct, index) in paginatedSubProducts" :key="SubProduct._id" style="text-align: center;">
              <th>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
            <td><span class="description">{{ getProductTitleById(SubProduct.productModelId) }}</span></td>
            <td><span class="description">{{ SubProduct.price }} $</span></td>
            <td><span class="description">{{ SubProduct.title }}</span></td>
            <td><span class="description">{{ SubProduct.description }}</span></td>
            <td>
              <img :src="SubProduct?.image?.url" class="SubProduct-img img-fluid" alt="SubProduct" style="margin: auto;" />
            </td>
            <td>
              <div class="wrapper-action">
                <button class="btn btn-danger" @click="deleteSubProduct(SubProduct)">
                  Delete
                </button>
                <button class="btn btn-warning ml-2" @click="openEditModal(SubProduct)">Edit</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-container">
  <ul class="pagination">
    <li class="page-item">
      <button class="page-link" @click="currentPage -= 1" :disabled="currentPage === 1">
        &#9668; Previous
      </button>
    </li>
    <li class="page-item" v-for="page in Math.ceil(SubProducts.length / itemsPerPage)" :key="page">
      <button class="page-link" @click="currentPage = page" :class="{ active: currentPage === page }">
        {{ page }}
      </button>
    </li>
    <li class="page-item">
      <button class="page-link" @click="currentPage += 1" :disabled="currentPage === Math.ceil(SubProducts.length / itemsPerPage)">
        Next &#9658;
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
          <h1 class="modal-title fs-5" id="exampleModalLabel">Create SubProduct</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="wrapper-form-input">
            <input type="text" class="form-control" placeholder="Title" v-model="form.title" />
            <textarea class="form-control mt-3" rows="4" placeholder="Description" v-model="form.description"></textarea>
            <input type="number" class="form-control mt-3" placeholder="Price" v-model="form.price" />
            <div class="input-group mt-3">
              <input ref="fileInput" type="file" class="form-control" v-on:change="onImageChange" />
            </div>

            <div class="input-group mt-3">
  <select class="form-select" v-model="form.productModelId" aria-label="Default select example">
    <option value="" disabled selected>Select a Product</option> <!-- Placeholder option -->
    <option v-for="item in productmodels" :key="item._id" :value="item._id">{{ item.title }}</option>
  </select>
</div>


          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="createSubProductAndClearModal" data-bs-dismiss="modal">
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
          <h1 class="modal-title fs-5" id="editModalLabel">Edit SubProduct</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="wrapper-form-input">
            <input type="text" class="form-control" placeholder="Title" v-model="editForm.title" />
            <textarea class="form-control mt-3" rows="4" placeholder="Description"
              v-model="editForm.description"></textarea>
              <input type="number" class="form-control mt-3" placeholder="Price" v-model="editForm.price" />
          </div>
          <div class="input-group mt-3">
            <input ref="editFileInput" type="file" class="form-control" @change="onEditImageChange" />
          </div>
        </div>

        <!-- Inside the Edit Modal -->
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="updateSubproductAndClearModal" data-bs-dismiss="modal">
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
      productmodels: [],
      SubProducts: [],
      currentPage: 1,
    itemsPerPage: 10,
      file: "",
      form: {
        title: "",
        description: "", // Add description field
        price: "",
        image: "",
        productModelId: ""
      },
      editForm: {
        id: "", // Store the ID of the SubProduct being edited
        title: "",
        description: "",
        price: "",
      },
    };
  },
  computed: {
    paginatedSubProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.SubProducts.slice(startIndex, endIndex);
  },
},
  methods: {
    getProductTitleById(productId) {
    const product = this.productmodels.find(item => item._id === productId);
    return product ? product.title : '';
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

    async ListProducts() {
      const data = await axios.get('/product').then(res => res.data.data.items)
      console.log(data)
      this.productmodels = data
    },

    openEditModal(SubProduct) {
      this.editForm.id = SubProduct._id;
      this.editForm.title = SubProduct.title;
      this.editForm.description = SubProduct.description;
      this.editForm.price = SubProduct.price;
      $("#editModal").modal("show"); // Use jQuery to open the modal
    },
    async updateSubproductAndClearModal() {
  try {
    const updateData = {
      title: this.editForm.title,
      price: this.editForm.price,
      description: this.editForm.description,
    };

    if (this.editForm.image) {
      updateData.image = this.editForm.image;
    }

    const updateResponse = await axios.put(`/sub-product/${this.editForm.id}`, updateData);
    if (updateResponse.status === 200) {
      await this.getSubProduct(); // Refresh SubProducts array
      await this.ListProducts(); // Refresh productmodels array

      this.editForm.id = "";
      this.editForm.title = "";
      this.editForm.description = "";
      this.editForm.price = "";
      this.editForm.image = "";
      $("#editModal").modal("hide");
      Swal.fire({
        icon: "success",
        title: "SubProduct Updated!",
        text: "The SubProduct has been successfully updated.",
      });
    }
  } catch (error) {
    console.error("Error updating SubProduct:", error);
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "Failed to update the SubProduct. Please try again.",
    });
  }
},


async getSubProduct() {
  try {
    const response = await axios.get("/sub-product").then(res => res.data.data);
    this.SubProducts = response;
  } catch (error) {
    console.error("Error fetching industries:", error);
  }
},

    async deleteSubProduct(SubProduct) {
      try {
        const result = await Swal.fire({
          title: "Confirm Deletion",
          text: "Are you sure you want to delete this SubProduct?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          const deleteResult = await axios.delete(`/sub-product/${SubProduct._id}`);
          if (deleteResult.status === 200) {
            this.SubProducts = this.SubProducts.filter(item => item._id !== SubProduct._id);

            Swal.fire({
              icon: "success",
              title: "SubProduct Deleted!",
              text: "The SubProduct has been successfully deleted.",
            });
          }
        }
      } catch (error) {
        console.error("Error deleting SubProduct:", error);
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Failed to delete the SubProduct. Please try again.",
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
    async createSubProduct() {
  try {
    const createResponse = await axios.post("/sub-product", this.form);

    if (createResponse.status === 201) {
      await this.getSubProduct(); // Refresh SubProducts array

      this.form.title = "";
      this.form.description = ""; // Clear description field
      this.form.price = "";
      this.form.image = "";
      this.showModal = false;

      Swal.fire({
        icon: "success",
        title: "SubProduct Created!",
        text: "The SubProduct has been successfully created.",
      });
    }
  } catch (error) {
    console.error("Error creating SubProduct:", error);
    Swal.fire({
      icon: "error",
      title: "Create Failed",
      text: "Failed to create the SubProduct. Please try again.",
    });
  }
},

    clearFileInput() {
      this.$refs.fileInput.value = '';
      this.$refs.editFileInput.value = ''; // Clear the edit file input value
    },

    async createSubProductAndClearModal() {
      try {
        await this.createSubProduct();
        this.clearFileInput();
        Swal.fire({
          icon: "success",
          title: "SubProduct Created!",
          text: "The SubProduct has been successfully created.",
        });

      } catch (error) {
        console.error("Error creating SubProduct:", error);
        Swal.fire({
          icon: "error",
          title: "Create Failed",
          text: "Failed to create the SubProduct. Please try again.",
        });
      }
    },
  },
  async mounted() {
    console.log("Component mounted. Fetching industries..."); // Add this log
  await this.getSubProduct();
  await this.ListProducts();
  this.currentPage = 1; // Set the current page to 1 initially
  },
};
</script>


<style lang="scss" scoped>
.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.SubProduct-page {
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

.SubProduct-img {
  width: 200px;
  height: 100px;
  object-fit: contain;
}
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
  