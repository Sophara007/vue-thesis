<template>
  <div class="container-fluid">
    <h1 class="mt-4">Top Up Management</h1>

    <div class="mt-4">
      <table class="table table-bordered">
        <thead class="thead-dark">
          <tr>
            <th scope="col">No</th>
            <th scope="col">Customer Name</th>
            <th scope="col">Email</th>
            <th scope="col">Amount</th>
            <th scope="col">Created At</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(topup, index) in paginatedtopups" :key="topup._id" >
            <th>{{ index + 1 }}</th>
            <td>{{ topup.userId.fullName }}</td>
            <td>{{ topup.userId.email }}</td>
            <td>{{ topup.amount }} $</td>
            <td>{{formatDate(topup.createdAt) }}</td>
            <td>
              <span :class="getStatusClass(topup.status)" style="font-weight: bold;">
                <span v-if="!topup.isEditing" @click="startEditingStatus(topup)">
                  {{ mapStatus(topup.status) }}
                  <i class="fa fa-pencil ml-2" style="cursor: pointer;"></i> <!-- Edit icon -->
                </span>
                <span v-else>
                  <!-- Use a div with a class for styling instead of the select element -->
                  <div class="status-dropdown-sm">
                    <select v-model="topup.newStatus" class="form-select form-select-sm">
                      <option value="1">Pending</option>
                      <option value="2">Agreed</option>
                      <option value="3">Rejected</option>
                    </select>
                  </div>
                  <button class="btn btn-primary btn-sm smaller-btn" @click="updateStatus(topup)">Save</button>
                  <button class="btn btn-secondary btn-sm smaller-btn" @click="cancelEditingStatus(topup)">Cancel</button>
                </span>
              </span>
            </td>
            <td>
              <button class="btn btn-primary" @click="viewTopUp(topup)">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Only show pagination if there are more than 10 items -->
    <div class="pagination-container" v-if="topups.length > 10">
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

  <!-- Modal for viewing top-up details -->
  <div class="modal fade" id="viewModal" tabindex="-1" role="dialog" aria-labelledby="viewModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="viewModalLabel">View Top-Up Details</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close" @click="closeViewModal">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <!-- Display top-up details here -->
          <div v-if="selectedTopUp">
            <p><strong>Customer Name:</strong> {{ selectedTopUp.userId.fullName }}</p>
            <p><strong>Email:</strong> {{ selectedTopUp.userId.email }}</p>
            <p><strong>Transaction ID:</strong> {{ selectedTopUp._id }}</p>
            <p><strong>Amount:</strong> {{ selectedTopUp.amount.toFixed(2) }} $</p>
            <p><strong>Ballance:</strong> {{ selectedTopUp.userId.ballance }} $</p>
            <p><strong>Status:</strong> <span :class="getStatusClass(selectedTopUp.status)">{{ mapStatus(selectedTopUp.status) }}</span></p>
            <!-- Photo area -->
            <div class="mb-3" v-if="selectedTopUp.transactionPhoto">
              <p><strong>Transaction Photo:</strong></p>
              <img
        :src="selectedTopUp.transactionPhoto.url"
        :class="{ 'topups-img': selectedTopUp.hasPadding }" 
        alt="Transaction Photo"
        class="img-fluid"
      />
            </div>
            <!-- Add more top-up details here as needed -->
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary bg-danger text-white" data-bs-dismiss="modal" @click="closeViewModal">Close</button>
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
      topups: [],
      selectedTopUp: null,
      currentPage: 1,
      itemsPerPage: 10,
      limit: 1000, // Default limit
      page: 1,   // Default page
    };
  },
  computed: {
    paginatedtopups() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.topups.slice(startIndex, endIndex); // Change this line
  },
    totalPages() {
      return Math.ceil(this.topups.length / this.itemsPerPage);
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
    const token = localStorage.getItem('token'); // Get the token from local storage
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios.get(`/topup?limit=${this.limit}&page=${this.page}`, { headers })
  .then(response => {
    this.topups = response.data.data.items;
    console.log('Fetched top-ups:', this.topups); // Add this line for debugging
  })
  .catch(error => {
    console.error('Error fetching data', error);
  });


  },
  methods: {
    setCurrentPage(page) {
      this.currentPage = page;
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
    cancelEditingStatus(topup) {
      // Reset the isEditing property to false
      topup.isEditing = false;

      // Optionally, you can revert the newStatus to the original status
      // This step is optional and depends on your use case
      topup.newStatus = topup.status;
    },
    startEditingStatus(topup) {
      topup.isEditing = true;
      topup.newStatus = topup.status; // Initialize newStatus with the current status
    },
    updateStatus(topup) {
  // Store the new status before making the API call
  const newStatus = parseInt(topup.newStatus);

  axios
    .put(`/topup/update-status/${topup._id}`, { status: newStatus })
    .then(response => {
      if (response.status === 200) {
        // The server has successfully updated the top-up status
        topup.status = newStatus; // Update the status locally
        topup.isEditing = false; // Exit edit mode
        console.log('Top-up status updated successfully:', response.data);
      } else {
        console.error('Failed to update top-up status. Server returned:', response.status);
        // If there's an error, you can optionally revert the status back to the original
        // topup.status = topup.status;
      }
    })
    .catch(error => {
      console.error('Error updating top-up status', error);
      // If there's an error, you can optionally revert the status back to the original
      // topup.status = topup.status;
    });
},



    viewTopUp(topup) {
      // Set the selectedTopUp and determine if padding should be applied
      this.selectedTopUp = topup;
      this.selectedTopUp.hasPadding = true; // You can set this condition based on your logic
      const modal = new bootstrap.Modal(document.getElementById('viewModal'));
      modal.show();
    },
    closeViewModal() {
      // Clear the selected "Top Up" record and close the modal
      this.selectedTopUp = null;
      const modal = new bootstrap.Modal(document.getElementById('viewModal'));
      modal.hide();
    },
    getStatusClass(status) {
      // Define your status classes here based on "Top Up" status codes
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
    getStatusTextClass(status) {
      // Define classes for the status text color
      // Modify this function according to your status codes
    },
    mapStatus(status) {
      // Map "Top Up" status codes to labels
      // Modify this function according to your status codes
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
  .status-dropdown-sm {
  display: flex;
  align-items: center;
  gap: 5px;
  /* Adjust the gap as needed */
}

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

h1 {
        font-size: 24px;
        font-weight: bold;
        text-transform: uppercase;
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
      th, td {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  
   
  }
  
  .topups-img {
  margin-left: 2px;
  padding: 10px; /* Adjust the padding to your preferred size */
  max-width: 400px; /* Limit the maximum width */
  max-height: 400px; /* Limit the maximum height */
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
  