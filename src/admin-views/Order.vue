<template>
    <div class="order-page container-fluid">
      <h1>Order Management</h1>
      <div class="wrapper-create m-5">
        <button class="btn btn-success custom-btn" data-bs-toggle="modal" data-bs-target="#createModal">
          Create Order
        </button>
      </div>
      <div class="wrapper-table">
        <table class="table">
          <thead>
            <tr style="text-align: center;">
              <th scope="col">Order No</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Product Type</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
  <tr v-for="(order, index) in orders" :key="order._id" :class="getStatusClass(order.status)" style="text-align: center;">
    <th>{{ index + 1 }}</th>
    <td>{{ order.orderNo }}</td>
    <td>{{ order.customerName }}</td>
    <td>{{ order.productType }}</td>
    <td>{{ order.totalAmount }}</td>
    <td>{{ getOrderStatusText(order.status) }}</td>
    <td>
      <div class="wrapper-action">
        <button class="btn btn-danger" @click="deleteOrder(order)">
          Cancel
        </button>
        <button @click="openEditModal(order)" data-bs-toggle="modal" data-bs-target="#editModal" class="btn btn-warning ml-2">Edit</button>
      </div>
    </td>
  </tr>
</tbody>

        </table>
      </div>
    </div>
  
    <!-- Rest of your modals -->
  
  </template>
  
  <script>
  export default {
    data() {
      return {
        orders: [], // Replace this with your actual order data
        form: {
          orderNo: '',
          customerName: '',
          productType: '',
          totalAmount: 0,
          status: 1 // Default to pending status
        },
        editForm: {
          orderNo: '',
          customerName: '',
          productType: '',
          totalAmount: 0,
          status: 1
        }
      };
    },
    methods: {
      getStatusClass(status) {
        return {
          'pending-class': status === 1,
          'accepted-class': status === 2,
          'success-class': status === 3,
          'reject-class': status === 4
        };
      },
      getOrderStatusText(status) {
        if (status === 1) return 'Pending';
        if (status === 2) return 'Accepted';
        if (status === 3) return 'Successful';
        if (status === 4) return 'Rejected';
        return 'Unknown';
      },
      // Define your methods for creating, updating, and deleting orders here
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .order-page {
    h1 {
      font-size: 24px;
      font-weight: bold;
      text-transform: uppercase;
    }
  
    .wrapper-create {
      display: flex;
      justify-content: flex-end;
      margin: 1rem 0;
    }
  
    .table {
      th, td {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  
    /* Status classes */
    .pending-class {
      background-color: gray;
      color: white;
    }
  
    .accepted-class {
      background-color: blue;
      color: white;
    }
  
    .success-class {
      background-color: green;
      color: white;
    }
  
    .reject-class {
      background-color: red;
      color: white;
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
  