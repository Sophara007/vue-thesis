<template>
  <div class="order-page container-fluid">
    <h1>Order Management</h1>

    <div class="d-flex justify-content-between align-items-center mb-3 mt-5">
  <!-- "Items Per Page" select element on the left -->
  <div class="items-per-page">
    <label for="itemsPerPageSelect" class="mr-2">Show:</label>
    <select
      id="itemsPerPageSelect"
      v-model="itemsPerPage"
      @change="updateItemsPerPage"
      class="custom-select custom-select-sm"
    >
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="50">50</option>
      <!-- Add more options as needed -->
    </select>
  </div>

  <!-- Search-related elements on the right -->
  <div class="d-flex">
    <div class="input-group input-group-sm" style="max-width: 200px;">
      <input
        type="text"
        class="form-control form-control-sm"
        placeholder="Search by Email"
        v-model="searchEmail"
      />
    </div>
    <button class="btn btn-sm btn-primary" @click="searchOrderByEmail">
      <i class="fas fa-search"></i> <!-- Font Awesome search icon -->
    </button>
    <button class="btn btn-sm btn-secondary" @click="resetSearch">Reset</button>
  </div>
</div>


    <div class="wrapper-table">
      <table class="table">
        <thead>
          <tr style="text-align: center;">
            <th scope="col">No</th>
            <th scope="col">Customer Name</th>
            <th scope="col">Item</th>
            <th scope="col">Payment Method</th>
            <th scope="col">Created At</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in paginatedorders" :key="order._id" :class="getStatusClass(order.status)"
            style="text-align: center;">
            <th>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th>
            <td>{{ order.userId.fullName }}</td>
            <td>{{ order.subProductId.title }}</td>
            <td>{{ mapPaymentMethod(order.paymentMethod) }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td :class="getStatusClass(order.status)">
  <span :class="getStatusTextClass(order.status)" style="font-weight: bold;">
    <span v-if="!order.isEditing">
      {{ mapStatus(order.status) }}
    </span>
    <span v-else>
      <span v-if="order.status !== 2 && order.status !== 3">
        <!-- Only show if status is not Agreed or Rejected -->
        <div class="status-dropdown-sm">
          <select v-model="order.newStatus" class="form-select form-select-sm">
            <option value="1">Pending</option>
            <option value="2">Agreed</option>
            <option value="3">Rejected</option>
          </select>
        </div>
        <button class="btn btn-primary btn-sm smaller-btn" @click="updateStatus(order)">Save</button>
        <button class="btn btn-secondary btn-sm smaller-btn" @click="cancelEditingStatus(order)">Cancel</button>
      </span>
    </span>
    <i v-if="!order.isEditing && order.status === 1" class="fa fa-pencil ml-2" style="cursor: pointer;"
       @click="startEditingStatus(order)"></i> <!-- Edit icon -->
  </span>
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
    <!-- Only show pagination if there are more than 10 items -->
    <div class="pagination-container" v-if="orders.length > 10">
      <ul class="pagination">
        <li class="page-item">
          <button class="page-link" @click="currentPage -= 1" :disabled="currentPage === 1">
            &#8592; Previous
          </button>
        </li>
        <li v-for="page in visiblePages" :key="page">
          <button class="page-link" @click="currentPage = page" :class="{ 'active': currentPage === page }">
            {{ page }}
          </button>
        </li>
        <li class="page-item">
          <button class="page-link" @click="currentPage += 1" :disabled="currentPage === totalPages">
            Next &#8594;
          </button>
        </li>

      </ul>
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
          <!-- <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close" @click="closeViewModal">
            <span aria-hidden="true">&times;</span>
          </button> -->
        </div>
        <div class="modal-body">
          <!-- Display order details here -->
          <div v-if="selectedOrder">
            <p><strong>Order ID:</strong> {{ selectedOrder._id }}</p>
            <p><strong>Customer Name:</strong> {{ selectedOrder.userId.fullName }}</p>
            <p><strong>Payment Method:</strong> {{ mapPaymentMethod(selectedOrder.paymentMethod) }}</p>
            <p><strong>Status:</strong> <span :class="getStatusTextClass(selectedOrder.status)"
                style="font-weight: bold;">{{ mapStatus(selectedOrder.status) }}</span></p>
            <p><strong>Phone Number:</strong> {{ selectedOrder.phoneNumber }}</p>
            <p><strong>Email:</strong> {{ selectedOrder.userId.email }}</p>
            <p><strong>Address:</strong> {{ selectedOrder.address }}</p>
            <hr>
            <p><strong>Item:</strong> {{ selectedOrder.subProductId.title }}</p>
            <p><strong>Price:</strong> {{ selectedOrder.subProductId.price }}<span> $</span></p>
            <img
              v-if="selectedOrder.subProductId && selectedOrder.subProductId.image && selectedOrder.subProductId.image.url"
              :src="selectedOrder.subProductId.image.url" class="subProduct-img img-fluid"
              :alt="selectedOrder.subProductId.title" />
            <!-- Add more order details here as needed -->
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary bg-red-500 hover:bg-red-600 text-white" data-bs-dismiss="modal"
            @click="closeViewModal">Close</button>
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
      searchEmail: "",
      originalOrders: [], // Initialize the originalOrders array
   
      currentPage: 1,
      itemsPerPage: 10,
      limit: 1000, // Default limit
      page: 1,   // Default page
    };
  },
  computed: {
    paginatedorders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + parseInt(this.itemsPerPage); // Parse the selected itemsPerPage
    return this.orders.slice(startIndex, endIndex);
  },
    totalPages() {
      return Math.ceil(this.orders.length / this.itemsPerPage);
    },

    visiblePages() {
      const maxVisiblePages = 5; // Adjust this value as needed
      const pages = [];

      if (this.totalPages <= maxVisiblePages) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (this.currentPage <= maxVisiblePages - 2) {
          for (let i = 1; i <= maxVisiblePages - 2; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(this.totalPages - 1);
          pages.push(this.totalPages);
        } else if (this.currentPage >= this.totalPages - maxVisiblePages + 3) {
          pages.push(1);
          pages.push(2);
          pages.push("...");
          for (let i = this.totalPages - maxVisiblePages + 3; i <= this.totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push(2);
          pages.push("...");
          for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(this.totalPages - 1);
          pages.push(this.totalPages);
        }
      }

      return pages;
    },
  },
  created() {
    // Fetch data from your API and update the orders array
    axios.get(`/order?limit=${this.limit}&page=${this.page}`)
    .then(response => {
      this.originalOrders = response.data.data.items;
      this.orders = [...this.originalOrders]; // Copy the data to orders
    })
    .catch(error => {
      console.error('Error fetching data', error);
    });

       // Fetch the initial data when the component is created
    this.fetchInitialData();

  },
  methods: {
    updateItemsPerPage() {
    // Reset the current page to 1 when changing the items per page
    this.currentPage = 1;
  },
      formatDate(isoDate) {
      const date = new Date(isoDate);
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
      };
      return date.toLocaleDateString('en-US', options);
    },
    resetSearch() {
  // Clear the search input
  this.searchEmail = "";

  // Reset the searchedOrderIndex to remove styling
  this.searchedOrderIndex = -1;

  // Fetch the initial data again to reset the list
  this.fetchInitialData();
},


    fetchInitialData() {
      // Fetch data from your API and update the orders array
      axios.get(`/order?limit=${this.limit}&page=${this.page}`)
        .then(response => {
          this.orders = response.data.data.items;
        })
        .catch(error => {
          console.error('Error fetching data', error);
        });
    },
    searchOrderByEmail() {
  const emailToSearch = this.searchEmail.trim();

  if (!emailToSearch) {
    // Handle empty search input as needed
    return;
  }

  // Filter the originalOrders array based on email
  this.orders = this.originalOrders.filter((order) => {
    if (order.userId && order.userId.email) {
      return order.userId.email.toLowerCase().includes(emailToSearch.toLowerCase());
    }
    return false;
  });

  // Reset the current page to 1
  this.currentPage = 1;
},




    setCurrentPage(page) {
      this.currentPage = page;
    },
    cancelEditingStatus(order) {
      // Reset the isEditing property to false
      order.isEditing = false;

      // Optionally, you can revert the newStatus to the original status
      // This step is optional and depends on your use case
      order.newStatus = order.status;
    },
    startEditingStatus(order) {
      // Allow editing only if the status is "Pending"
      if (order.status === 1) {
        order.isEditing = true;
        order.newStatus = order.status; // Initialize newStatus with the current status
      }
    },
    updateStatus(order) {
      const newStatus = parseInt(order.newStatus);

      axios
        .put(`/order/${order._id}`, { status: newStatus }) // Replace with your endpoint and data structure
        .then(response => {
          if (response.status === 200) {
            // The server has successfully updated the order status
            order.status = newStatus; // Update the status locally
            order.isEditing = false; // Exit edit mode
            console.log('Order status updated successfully:', response.data);
          } else {
            console.error('Failed to update order status. Server returned:', response.status);
          }
        })
        .catch(error => {
          console.error('Error updating order status', error);
        });
    },
    viewOrder(order) {
      // Set the selectedOrder and open the modal
      this.selectedOrder = order;
      const modal = new bootstrap.Modal(document.getElementById('viewModal'));
      modal.show();
    },
    closeViewModal() {
  // Clear the selected order, close the modal, and clear the search input
  this.selectedOrder = null;
 
  const modal = new bootstrap.Modal(document.getElementById("viewModal"));
  modal.hide();
},

    getStatusClass(status) {
      // Define your status classes here as you did in your original code
    },
    getStatusTextClass(status) {
      // Define classes for the status text color
      switch (status) {
        case 1:
          return 'badge bg-warning';
        case 2:
          return 'badge bg-success';
        case 3:
          return 'badge bg-danger';
        default:
          return 'badge bg-secondary';
      }
    },
    mapStatus(status) {
      // Map status codes to labels
      switch (status) {
        case 1:
          return 'Pending';
        case 2:
          return 'Agreed';
        case 3:
          return 'Rejected';
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
  async mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const limitParam = urlParams.get('limit');
    const pageParam = urlParams.get('page');

    // Update limit and page with query parameter values if provided
    if (limitParam) {
      this.limit = parseInt(limitParam);
    }
    if (pageParam) {
      this.page = parseInt(pageParam);
    }

  },
};
</script>

<style lang="scss" scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination {
  display: flex;
  list-style: none;
  padding: 0;
}

.page-item {
  margin: 0;
}

.page-link {
  display: inline-block;
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  color: #333;
  text-decoration: none;
  cursor: pointer;
}

.page-link.active {
  background-color: #007bff;
  color: #fff;
}

.page-link:hover {
  background-color: #e9e9e9;
}

.page-link:disabled {
  background-color: #ddd;
  color: #999;
  cursor: not-allowed;
}

.page-link:focus {
  outline: none;
  box-shadow: none;
}


span {
  margin-left: 2px;
}

.status-dropdown-sm {
  display: flex;
  align-items: center;
  gap: 5px;
  /* Adjust the gap as needed */
}

/* Adjust the font size and padding for the smaller buttons */
.smaller-btn {
  font-size: 12px;
  padding: 2px 4px;
}

/* Adjust the padding and font size for the smaller select */
.form-select-sm {
  padding: 2px 5px;
  font-size: 12px;
}

.status-dropdown {
  position: relative;
  display: inline-block;
}

.status-dropdown select {
  padding: 5px;
  border: 1px solid #ccc;
  background-color: white;
  appearance: none;
  /* Remove default styles */
  color: black;
  /* Set the text color to black */
}

.status-dropdown::before {
  content: '\f078';
  /* Unicode for the down arrow icon */
  font-family: FontAwesome;
  /* Use FontAwesome for the arrow icon */
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  pointer-events: none;
  /* Allow clicks on select, not on the arrow */
}

/* Style the arrow icon */
.status-dropdown::before {
  content: '\f0d7';
  /* Unicode for a down arrow (you may need to adjust the icon code) */
  font-family: FontAwesome;
  /* Use FontAwesome for the arrow icon */
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  pointer-events: none;
  /* Allow clicks on select, not on the arrow */
}

/* Style the select dropdown when it's open */
.status-dropdown select:focus {
  border-color: #007bff;
  /* Add focus style when the select is open */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  /* Add focus shadow when the select is open */
}

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

    th,
    td {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }


}

.slider-img {
  position: relative;
  width: 200px;
  height: 100px;
  object-fit: contain;
}

.subProduct-img {
  margin-left: 20px;
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
}</style>
