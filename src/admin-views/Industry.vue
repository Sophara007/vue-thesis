<template>
  <div class="industry-page container-fluid">
    <h1>Industry Page</h1>
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
          <tr v-for="(industry, index) in industries" :key="industry._id">
            <th>{{ index + 1 }}</th>
            <td>{{ industry.title }}</td>
            <td>{{ industry.description }}</td>
            <td>
              <img
                :src="industry?.image?.url"
                class="industry-img img-fluid"
                alt="industry"
              />
            </td>
            <td>
              <div class="wrapper-action">
                <button class="btn btn-danger" @click="deleteIndustry(industry)">
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
        <h1 class="modal-title fs-5" id="exampleModalLabel">Create Industry</h1>
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
    @click="createIndustryAndClearModal"
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
import Swal from "sweetalert2";

export default {
  data() {
    return {
      industries: [],
      file: "",
      form: {
        title: "",
        description: "", // Add description field
        image: "",
      },
    };
  },
  methods: {
    async getIndustries() {
  console.log("Fetching industries...");
  try {
    const response = await axios.get("/industry");
    console.log("API response:", response);
    if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
      const industries = response.data.data.items;
      console.log("Fetched industries:", industries);
      console.log("Number of industries:", industries.length);
      this.industries = industries;
    } else {
      console.error("Invalid API response format:", response.data);
    }
  } catch (error) {
    console.error("Error fetching industries:", error);
  }
},
    async deleteIndustry(industry) {
      const deleteResult = await axios.delete(`/industry/${industry._id}`);
      if (deleteResult.status === 200) {
        this.industries = this.industries.filter(item => item._id !== industry._id);
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
    async createIndustry() {
      try {
        const createResponse = await axios.post("/industry", this.form);

        if (createResponse.status === 201) {
          this.getIndustries();
          this.form.title = "";
          this.form.description = ""; // Clear description field
          this.form.image = "";
          this.showModal = false;
        }
      } catch (error) {
        console.error("Error creating industry:", error);
      }
    },
    clearFileInput() {
    this.$refs.fileInput.value = ''; // Clear the file input value
  },

  async createIndustryAndClearModal() {
    this.createIndustry();
    this.clearFileInput(); // Clear the file input after creating a service
  },
  },
  async mounted() {
    console.log("Component mounted. Fetching industries..."); // Add this log
    await this.getIndustries();
  },
};
</script>



<style lang="scss" scoped>
.industry-page {
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
.industry-img {
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