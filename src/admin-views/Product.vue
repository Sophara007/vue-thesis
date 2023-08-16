<template>
  <div class="product-page container-fluid">
    <h1>product page</h1>
    <div class="wrapper-create m-5">
      <button class="btn btn-success custom-btn" data-bs-toggle="modal" data-bs-target="#createModal">
        Create
      </button>
    </div>
    <div class="wrapper-table">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">N0</th>
            <th scope="col">Title</th>
            <th scope="col">Image</th>
            <th scope="col">Description</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.index">
            <th>{{index + 1 }}</th>
            <td>{{ product.title }}</td>
            <td>
              <img :src="product?.logo?.url" class="product-img img-fluid" alt="product" />
            </td>
            <td>{{ product.description }}</td>
            <td>
              <div class="wrapper-action">
                <button class="btn btn-danger" @click="deleteProduct(product)">
                  Delete
                </button>
                <button class="btn btn-warning ml-2">Edit</button>
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
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Create Product
          </h1>
        </div>
        <div class="modal-body">
          <div class="wrapper-form-input">
            <input type="text" class="form-control" placeholder="Title" v-model="form.title" /> <br>
            <input type="text" class="form-control" placeholder="description" v-model="form.description" /> <br>
            
            <div class="input-group mt-3">
              <input type="file" class="form-control" v-on:change="onImageChange" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="createProduct">
            Create
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
      file: "",
      form: {
        title: "",
        description: "",
        logo: "",
      },
    };
  },
  methods: {
    async getProduct() {
      const products = await axios.get("/product").then((res) => res.data.data.items);
      this.products = products;
      console.log((this.products = products));
    },
    async deleteProduct(product) {
      console.log("product", product._id);
      const deleteResult = await axios.delete(`/product/${product._id}`);
      if (deleteResult.status == 200) {
        location.reload();
      }
      console.log(deleteResult);
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
      this.form.logo = upload?._id;
    },
    async createProduct() {
      console.log(this.form);
      const create = await axios.post("/product/create", this.form);

      if (create.status == 201) {
        location.reload();
      }
    },
  },
  async mounted() {
    await this.getProduct();
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
  