<template>
  <div class="slider-page container-fluid">
    <h1>homepage slider</h1>
    <div class="wrapper-create m-5">
      <button class="btn btn-success custom-btn" data-bs-toggle="modal" data-bs-target="#createModal">
        Create
      </button>
    </div>
    <div class="wrapper-table">
      <table class="table">
        <thead>
          <tr style="text-align: center;">
            <th scope="col">N0</th>
            <th scope="col">Title</th>
            <th scope="col">Image</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(slider, index) in sliders" :key="slider.index" style="text-align: center;">
            <th>{{ index + 1 }}</th>
            <td>{{ slider.title }}</td>
            <td>
              <img :src="slider?.image?.url" class="slider-img img-fluid" alt="slider"  style="margin: auto;"/>
            </td>
            <td>
              <div class="wrapper-action">
                <button class="btn btn-danger" @click="deleteSlider(slider)">
                  Delete
                </button>
                <button @click="openEditModal(slider)" data-bs-toggle="modal" data-bs-target="#editModal" class="btn btn-warning ml-2">Edit</button>
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
          <h1 class="modal-title fs-5" id="exampleModalLabel">Create Partner</h1>
        </div>
        <div class="modal-body">
          <div class="wrapper-form-input">
            <input type="text" class="form-control" placeholder="Title" v-model="form.title" />
            <div class="input-group mt-3">
              <input ref="fileInput" type="file" class="form-control" v-on:change="onImageChange" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="createSliderAndClearModal" data-bs-dismiss="modal">
            Create
          </button>
        </div>
      </div>
    </div>
  </div>


  <div class="modal fade wrapper-modal" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="editModalLabel">Edit Slider</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="wrapper-form-input">
            <input type="text" class="form-control" placeholder="Title" v-model="editForm.title" />
          </div>
          <div class="input-group mt-3">
            <input ref="editFileInput" type="file" class="form-control" @change="onEditImageChange" />
          </div>
        </div>
        <!-- Inside the Edit Modal -->

        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="updateSliderAndClearModal" data-bs-dismiss="modal">
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
      sliders: [],
      file: "",
      form: {
        title: "",
        image: "",
      },
      editForm: {
        id: "",
        title: "",
      },
    };
  },
  methods: {
    async getSlider() {
      const sliders = await axios
        .get("/slider")
        .then((res) => res.data);
      this.sliders = sliders;
      console.log((this.sliders = sliders));
    },

    // delete
    async deleteSlider(slider) {
      try {
        const result = await Swal.fire({
          title: "Confirm Deletion",
          text: "Are you sure you want to delete this slider?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          const deleteResult = await axios.delete(
            `/slider/${slider._id}`
          );
          if (deleteResult.status === 200) {
            this.sliders = this.sliders.filter(
              (item) => item._id !== slider._id
            );
            Swal.fire({
              icon: "success",
              title: "Slider Deleted!",
              text: "The slider has been successfully deleted.",
            });
          }
        }
      } catch (error) {
        console.error("Error deleting slider:", error);
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Failed to delete the slider. Please try again.",
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

    async createSlider() {
      try {
        const createResponse = await axios.post("/slider", this.form);
        if (createResponse.status === 201) {
          this.getSlider();
          this.form.title = "";
          this.form.image = "";
        }
      } catch (error) {
        console.error("Error creating homepage slider:", error);
      }
    },

    clearFileInput() {
      this.$refs.fileInput.value = "";
    },

  //create
    async createSliderAndClearModal() {
      try {
        await this.createSlider();
        this.clearFileInput();
        Swal.fire({
          icon: "success",
          title: "Slider Created!",
          text: "The slider has been successfully created.",
        });
      } catch (error) {
        console.error("Error creating slider:", error);
        Swal.fire({
          icon: "error",
          title: "Create Failed",
          text: "Failed to create the slider. Please try again.",
        });
      }
    },

    // update
    async openEditModal(slider) {
      this.editForm.id = slider._id;
      this.editForm.title = slider.title;
      $("#editModal").modal("show");
    },
    async updateSliderAndClearModal() {
      try {
        const updateData = {
          title: this.editForm.title,
        };

        if (this.editForm.image) {
          updateData.image = this.editForm.image; // Include image if it's updated
        }

        const updateResponse = await axios.put(
          `/slider/${this.editForm.id}`,
          updateData
        );
        if (updateResponse.status === 200) {
          this.getSlider();
          this.editForm.id = "";
          this.editForm.title = "";
          this.editForm.image = "";
          $("#editModal").modal("hide");

          Swal.fire({
            icon: "success",
            title: "Slider Updated!",
            text: "The slider has been successfully updated.",
          });
        }
      } catch (error) {
        console.error("Error updating slider:", error);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update the slider. Please try again.",
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
    await this.getSlider();
  },
};
</script>
  
<style lang="scss" scoped>

td {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.slider-page {
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

.slider-img {
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
  