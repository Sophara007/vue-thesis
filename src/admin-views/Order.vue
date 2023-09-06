<template>
  <div class="order-page container-fluid">
    <h1>Order Management</h1>

    <div class="wrapper-table">
      <table class="table">
        <thead>
          <tr style="text-align: center;">
            <th scope="col">Order No</th>
            <th scope="col">Customer Name</th>
            <th scope="col">Item</th>
            <th scope="col">Payment Method</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="order._id" :class="getStatusClass(order.status)" style="text-align: center;">
            <th>{{ index + 1 }}</th>
            <td>{{ order.fullName }}</td>
            <td><!-- Replace this with the item information --></td>
            <td>{{ mapPaymentMethod(order.paymentMethod) }}</td>
            <td><!-- Replace this with the total --></td>
            <td :class="getStatusClass(order.status)">
              <span :class="getStatusTextClass(order.status)" style="font-weight: bold;">{{ mapStatus(order.status) }}</span>
            </td>
            <td>
              <button class="btn btn-primary" @click="viewOrder(order)">
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal for creating an order -->
  <div class="modal" id="createModal" tabindex="-1" role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <!-- ... (modal content for creating an order) ... -->
      </div>
    </div>
  </div>

  <!-- Modal for viewing order details -->
  <div class="modal fade" id="viewModal" tabindex="-1" role="dialog" aria-labelledby="viewModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="viewModalLabel">View Order Details</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close" @click="closeViewModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <!-- Display order details here -->
          <div v-if="selectedOrder">
            <p><strong>Order No:</strong> {{ selectedOrder._id }}</p>
            <p><strong>Customer Name:</strong> {{ selectedOrder.fullName }}</p>
            <p><strong>Payment Method:</strong> {{ mapPaymentMethod(selectedOrder.paymentMethod) }}</p>
            <p><strong>Status:</strong> <span :class="getStatusTextClass(selectedOrder.status)" style="font-weight: bold;">{{ mapStatus(selectedOrder.status) }}</span></p>
            <p><strong>phoneNumber:</strong> {{ selectedOrder.phoneNumber }}</p>
            <p><strong>address:</strong> {{ selectedOrder.address }}</p>
            <!-- Add more order details here as needed -->
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary bg-red-500 hover:bg-red-600 text-white" data-bs-dismiss="modal" @click="closeViewModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [],
      selectedOrder: null,
    };
  },
  created() {
    // Fetch data from your API and update the orders array
    axios.get('/order') // Replace with your API endpoint
      .then(response => {
        this.orders = response.data.data.items; // Assuming 'items' contains the list of orders
      })
      .catch(error => {
        console.error('Error fetching data', error);
      });
  },
  methods: {
    viewOrder(order) {
      // Set the selectedOrder and open the modal
      this.selectedOrder = order;
      const modal = new bootstrap.Modal(document.getElementById('viewModal'));
      modal.show();
    },
    closeViewModal() {
      // Clear the selected order and close the modal
      this.selectedOrder = null;
      const modal = new bootstrap.Modal(document.getElementById('viewModal'));
      modal.hide();
    },
    getStatusClass(status) {
      // Define your status classes here as you did in your original code
    },
    getStatusTextClass(status) {
      // Define classes for the status text color
      switch (status) {
        case 1:
          return 'badge bg-success';
        case 2:
          return 'badge bg-danger';
        case 3:
          return '"badge bg-warning text-dark';
        default:
          return 'badge bg-secondary';
      }
    },
    mapStatus(status) {
      // Map status codes to labels
      switch (status) {
        case 1:
          return 'Agreed';
        case 2:
          return 'Rejected';
        case 3:
          return 'Pending';
        default:
          return 'Unknown';
      }
    },
    mapPaymentMethod(paymentMethod) {
      // Map payment method codes to labels
      switch (paymentMethod) {
        case 1:
          return 'Cash on Delivery';
        case 2:
          return 'Online Payment';
        default:
          return 'Unknown';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-page {
  h1 {
    font-size: 24px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 90px;
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
