<template>
  <div class="service-page container-fluid">
    <h1>Service Page</h1>
    <div class="wrapper-create m-5">
      <button
        class="btn btn-success custom-btn"
        data-bs-toggle="modal"
        data-bs-target="#createModal"
      >
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
          <tr v-for="(service, index) in services" :key="service._id">
  <th>{{ index + 1 }}</th>
  <td>{{ service.title }}</td>
  <td>{{ service.description }}</td>
  <td>
    <img
      :src="service?.image?.url"
      class="service-img img-fluid"
      :alt="service?.image?.alt || 'service'"
      :title="service?.image?.title || service.title"
    />
    <p>{{ service?.image?.description || '' }}</p>
  </td>
  <td>
    <div class="wrapper-action">
      <button class="btn btn-danger" @click="deleteService(service)">
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
  <div
    class="modal fade wrapper-modal"
    id="createModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Create Service</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="wrapper-form-input">
            <input
              type="text"
              class="form-control"
              placeholder="Title"
              v-model="form.title"
            />
            <textarea
              class="form-control mt-3"
              rows="4"
              placeholder="Description"
              v-model="form.description"
            ></textarea>
            <div class="input-group mt-3">
              <input
  ref="fileInput"
  type="file"
  class="form-control"
  v-on:change="onImageChange"
/>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
    type="button"
    class="btn btn-success"
    @click="createServiceAndClearModal"
    data-bs-dismiss="modal"
  >
    Create
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
      services: [],
      file:"",
      form: {
        title: "",
        description: "",
        image: "",
      },
    };
  },
  methods: {
    async getServices() {
      try {
        const response = await axios.get("/service-company");
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
      const deleteResult = await axios.delete(`/service-company/${service._id}`);
      if (deleteResult.status === 200) {
        this.services = this.services.filter(
          (item) => item._id !== service._id
        );
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
        const createResponse = await axios.post("/service-company/create", this.form);
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
    this.$refs.fileInput.value = ''; // Clear the file input value
  },

  async createServiceAndClearModal() {
    this.createService();
    this.clearFileInput(); // Clear the file input after creating a service
  },
  },
  async mounted() {
    await this.getServices();
  },
};
</script>

<style lang="scss" scoped>
.service-page {
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
.service-img {
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

