<template>
  <div class="slider-page container-fluid">
    <h1>partner page</h1>
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
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(slider, index) in sliders" :key="slider.index">
            <th>{{index + 1 }}</th>
            <td>{{ slider.title }}</td>
            <td>
              <img :src="slider?.image?.url" class="slider-img img-fluid" alt="slider" />
            </td>
            <td>
              <div class="wrapper-action">
                <button class="btn btn-danger" @click="deleteSlider(slider)">
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
          <h1 class="modal-title fs-5" id="exampleModalLabel">Create Slider</h1>
        </div>
        <div class="modal-body">
          <div class="wrapper-form-input">
            <input type="text" class="form-control" placeholder="Title" v-model="form.title" />
            <div class="input-group mt-3">
              <input type="file" class="form-control" v-on:change="onImageChange" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="createSlider">
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
      sliders: [],
      file: "",
      form: {
        title: "",
        image: "",
      },
    };
  },
  methods: {
    async getSlider() {
      const sliders = await axios.get("/slider/partner").then((res) => res.data);
      this.sliders = sliders;
      console.log(this.sliders = sliders);
    },
    async deleteSlider(slider) {
      console.log("slider", slider._id);
      const deleteResult = await axios.delete(`/slider/partner/${slider._id}`);
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
      this.form.image = upload?._id;
    },
    async createSlider() {
      console.log(this.form);
      const create = await axios.post("/slider/partner", this.form)

      if (create.status == 201) {
        location.reload();
      }
    },
  },
  async mounted() {
    await this.getSlider();
  },
};
</script>
  
<style lang="scss" scoped>
.slider-page {
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

.slider-img {
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
  