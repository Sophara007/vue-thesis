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
          <tr>
            <th scope="col">No</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Image</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product._id">
            <th>{{ index + 1 }}</th>
            <td>{{ product.title }}</td>
            <td>{{ product.description }}</td>
            <td>
              <img :src="product?.logo?.url" class="product-img img-fluid" :alt="product?.logo?.alt || 'product'"
                :title="product?.logo?.title || product.title" />
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
export default {
  data() {
    return {
      products: [],
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

  methods: {
    async getProducts() {
      try {
        const response = await axios.get("/product");
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
      const deleteResult = await axios.delete(`/product/${product._id}`);
      if (deleteResult.status === 200) {
        this.products = this.products.filter((item) => item._id !== product._id);
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
      this.$refs.fileInput.value = ""; // Clear the file input value
    },

    async createProductAndClearModal() {
      this.createProduct();
      this.clearFileInput();
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
        }
      } catch (error) {
        console.error("Error updating product:", error);
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
    await this.getProducts();
  },
};
</script>


<style lang="scss" scoped>
.product-page {
  h1 {
    font-size: 24px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .wrapper-create {
    display: flex;
    justify-content: end;
  }
}

.product-img {
  width: 300px;
  height: 150px;
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

