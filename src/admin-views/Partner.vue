<template>
  <div class="partner-page container-fluid">
    <h1>PARTNER PAGE</h1>
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
          <tr v-for="(partner, index) in partners" :key="partner.index" style="text-align: center;">
            <th>{{ index + 1 }}</th>
            <td>{{ partner.title }}</td>
            <td>
              <img :src="partner?.image?.url" class="partner-img img-fluid" alt="partner"  style="margin: auto;"/>
            </td>
            <td>
              <div class="wrapper-action">
                <button class="btn btn-danger" @click="deletePartner(partner)">
                  Delete
                </button>
                <button @click="openEditModal(partner)" data-bs-toggle="modal" data-bs-target="#editModal" class="btn btn-warning ml-2">Edit</button>
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
          <button type="button" class="btn btn-success" @click="createPartnerAndClearModal" data-bs-dismiss="modal">
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
          <h1 class="modal-title fs-5" id="editModalLabel">Edit Partner</h1>
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
          <button type="button" class="btn btn-success" @click="updatePartnerAndClearModal" data-bs-dismiss="modal">
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
      partners: [],
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
    async getPartner() {
      const partners = await axios
        .get("/slider/partner")
        .then((res) => res.data);
      this.partners = partners;
      console.log((this.partners = partners));
    },

    // delete
    async deletePartner(partner) {
      try {
        const result = await Swal.fire({
          title: "Confirm Deletion",
          text: "Are you sure you want to delete this partner?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          const deleteResult = await axios.delete(
            `/slider/partner/${partner._id}`
          );
          if (deleteResult.status === 200) {
            this.partners = this.partners.filter(
              (item) => item._id !== partner._id
            );
            Swal.fire({
              icon: "success",
              title: "Partner Deleted!",
              text: "The partner has been successfully deleted.",
            });
          }
        }
      } catch (error) {
        console.error("Error deleting partner:", error);
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Failed to delete the partner. Please try again.",
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

    async createPartner() {
      try {
        const createResponse = await axios.post("/slider/partner", this.form);
        if (createResponse.status === 201) {
          this.getPartner();
          this.form.title = "";
          this.form.image = "";
        }
      } catch (error) {
        console.error("Error creating homepage partner:", error);
      }
    },

    clearFileInput() {
      this.$refs.fileInput.value = "";
    },

  //create
    async createPartnerAndClearModal() {
      try {
        await this.createPartner();
        this.clearFileInput();
        Swal.fire({
          icon: "success",
          title: "Partner Created!",
          text: "The partner has been successfully created.",
        });
      } catch (error) {
        console.error("Error creating partner:", error);
        Swal.fire({
          icon: "error",
          title: "Create Failed",
          text: "Failed to create the partner. Please try again.",
        });
      }
    },

    // update
    async openEditModal(partner) {
      this.editForm.id = partner._id;
      this.editForm.title = partner.title;
      $("#editModal").modal("show");
    },
    async updatePartnerAndClearModal() {
      try {
        const updateData = {
          title: this.editForm.title,
        };

        if (this.editForm.image) {
          updateData.image = this.editForm.image; // Include image if it's updated
        }

        const updateResponse = await axios.put(
          `/slider/partner/${this.editForm.id}`,
          updateData
        );
        if (updateResponse.status === 200) {
          this.getPartner();
          this.editForm.id = "";
          this.editForm.title = "";
          this.editForm.image = "";
          $("#editModal").modal("hide");

          Swal.fire({
            icon: "success",
            title: "Partner Updated!",
            text: "The partner has been successfully updated.",
          });
        }
      } catch (error) {
        console.error("Error updating partner:", error);
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Failed to update the partner. Please try again.",
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
    await this.getPartner();
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
.partner-page {
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

.partner-img {
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
  