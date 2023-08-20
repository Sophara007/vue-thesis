<template>
    <div class="admin-page container-fluid">
      <h1>Create Admin Page</h1>
      <div class="wrapper-create m-5">
        <button class="btn btn-success custom-btn" data-bs-toggle="modal" data-bs-target="#createModal">
          Create
        </button>
      </div>
      <div class="wrapper-table">
        <table class="table">
          <thead>
            <tr>
              <th scope="col" >No</th>
              <th scope="col" >Username</th>
              <th scope="col" >Email</th>
              <th scope="col" >Password</th>
              <th scope="col" style="text-align: center;" >Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>admin</td>
              <td>admin@gmail.com</td>
              <td>12345678</td>
              <td>
                <div class="wrapper-action" style="text-align: center;">
                  <button class="btn btn-danger">Delete</button>       
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
            <h1 class="modal-title fs-5" id="exampleModalLabel">Create Admin</h1> 
          </div>
          <div class="modal-body">
            <div class="wrapper-form-input">
                <input type="text" class="form-control mb-3" placeholder="Full Name" v-model="form.name"/>
                <input type="email" class="form-control mb-3" placeholder="Email" v-model="form.email"/>
                <input type="password" class="form-control mb-3" placeholder="Password" v-model="form.password"/>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="createAdmin">Create</button>
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
          form: {
            name: "",
            email: "",
            password: "",
          }
        }
      },
      methods: {
        async createAdmin() {
          try {
            const createResponse = await axios.post("/admin/create", this.form);
            if (createResponse.status === 201) {
              this.form.name = "";
              this.form.email = "";
              this.form.password = "";
            }
          } catch (error) {
            console.error("Error creating homepage slider:", error);
          }
        },
      },
    }
</script>
  
  <style lang="scss" scoped>
  
  .admin-page {
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
  
  .admin-img {
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
  