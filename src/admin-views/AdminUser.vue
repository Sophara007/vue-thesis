<template>
    <div class="admin-page container-fluid">
      <h1>Create Admin</h1>
      <div class="wrapper-create m-5">
        <button class="btn btn-success custom-btn" data-bs-toggle="modal" data-bs-target="#createModal">
          Create
        </button>
      </div>
      <div class="wrapper-table">
        <table class="table">
          <thead>
            <tr>
              <th scope="col" style="width: 10%;" >No</th>
              <th scope="col" style="width: 20%;">Username</th>
              <th scope="col" style="width: 20%;">Email</th>
              <th scope="col" style="text-align: center; width: 20%;" >Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>Admin</td>
              <td>admin@bluetech.com</td>
              <td>
                <div class="wrapper-action" style="text-align: center;">
                  <button class="btn btn-danger">Delete</button>
                  <button class="btn btn-warning ml-2">Edit</button>         
                </div>
              </td>
            </tr>
            <tr>
              <th>2</th>
              <td>Sohun</td>
              <td>sohun@gmail.com</td>
              <td>
                <div class="wrapper-action" style="text-align: center;">
                  <button class="btn btn-danger">Delete</button>
                  <button class="btn btn-warning ml-2">Edit</button>         
                </div>
              </td>
            </tr>
            <tr>
              <th>3</th>
              <td>Theara</td>
              <td>theara@gmail.com</td>
              <td>
                <div class="wrapper-action" style="text-align: center;">
                  <button class="btn btn-danger">Delete</button>
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
            <h1 class="modal-title fs-5" id="exampleModalLabel">Create Admin</h1> 
          </div>
          <div class="modal-body">
            <div class="wrapper-form-input">
                <input type="text" class="form-control mb-3" placeholder="Full Name"/>
                <input type="email" class="form-control mb-3" placeholder="Email"/>
                <input type="password" class="form-control mb-3" placeholder="Password"/>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" data-bs-dismiss="modal">Create</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <!-- <div class="modal fade wrapper-modal" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editModalLabel">Edit</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="wrapper-form-input">
              <input type="text" class="form-control" placeholder="Title" />
              <textarea class="form-control mt-3" rows="4" placeholder="Description"
                ></textarea>
            </div>
            <div class="input-group mt-3">
              <input ref="editFileInput" type="file" class="form-control"  />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-success"  data-bs-dismiss="modal">
              Update
            </button>
          </div>
        </div>
      </div>
    </div> -->
  </template>
  
<script>
    export default {
        
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
  