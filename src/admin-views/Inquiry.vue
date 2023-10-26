<template>
    <div class="inquiry-page container-fluid">
        <h1> Inquiry page</h1>

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
      placeholder="Search"
      v-model="searchQuery"
    />
  </div>
  <button class="btn btn-sm btn-primary" @click="searchOrders">
    <i class="fas fa-search"></i> <!-- Font Awesome search icon -->
  </button>
  <button class="btn btn-sm btn-secondary" @click="resetSearch">Reset</button>
</div>

</div>



        <div class="wrapper-table">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(inquiry, index) in paginatedinquiries" :key="inquiry.index">
                      <th>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</th> <!-- Change this line -->
                        <td>{{ inquiry.fullName }}</td>
                        <td>
                            {{ inquiry.email }}
                        </td>
                        <td>
                            {{ inquiry.subject }}
                        </td>
                        <td>{{formatDate(inquiry.createdAt) }}</td>
                        <td>
                            <div class="wrapper-action">
                                <button class="btn btn-info" data-bs-toggle="modal" @click="getOne(inquiry)"
                                    data-bs-target="#viewInquiry">
                                    View
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Only show pagination if there are more than 10 items -->
    <div class="pagination-container" v-if="inquiries.length > 10">
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

    <!-- model -->


    <!-- Modal -->
    <div class="modal fade wrapper-modal" id="viewInquiry" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Inquiry Information</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="wrapper-inquiry">
                        <h6><strong>From</strong> : {{ inquiry.fullName }}</h6>
                        <h6><strong>Email</strong> : {{ inquiry.email }}</h6>
                        <h6><strong>Promotion Code</strong> : {{ inquiry.promotionCode }}</h6>
                        <br>
                        <h6><strong>Subject</strong> : {{ inquiry.subject }}</h6>
                        <p>{{ inquiry.message }}</p>
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
import axios from "axios";
export default {
    data() {
        return {
            currentPage: 1,       
            searchFullName: "", // Initialize with an empty string
            searchEmail: "",
            originalOrders: [], // Initialize the originalOrders array
     
      itemsPerPage: 10,
      limit: 1000, // Default limit
      page: 1,   // Default page
            inquiries: [],
            inquiry: {}
        }
    },
    created() {

// Fetch the initial data when the component is created
this.fetchInitialData();

},
    computed: {
    paginatedinquiries() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + parseInt(this.itemsPerPage); // Parse the selected itemsPerPage
      return this.inquiries.slice(startIndex, endIndex);

    },
    totalPages() {
      return Math.ceil(this.inquiries.length / this.itemsPerPage);
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
    methods: {
      updateItemsPerPage() {
    // Reset the current page to 1 when changing the items per page
    this.currentPage = 1;
  },
  resetSearch() {
   // Clear the search inputs
   this.searchEmail = "";
  this.searchFullName = "";
  
  // Clear the search query (if it exists)
  this.searchQuery = "";

  // Fetch the initial data to reset the list
  this.fetchInitialData();
},


    
fetchInitialData() {
  // Fetch data from your API and update the 'inquiries' array
  axios.get(`/messages?limit=${this.limit}&page=${this.page}`)
    .then(response => {
      this.inquiries = response.data.data.items;
      // Set the 'originalInquiries' to the same data
      this.originalInquiries = response.data.data.items;
    })
    .catch(error => {
      console.error('Error fetching data', error);
    });
},
searchOrders() {
  const query = this.searchQuery.trim().toLowerCase();

  if (!query) {
    // Handle empty search input as needed
    return;
  }

  // Filter the inquiries based on email or full name fields
  this.inquiries = this.originalInquiries.filter((inquiry) => {
    const inquiryEmail = inquiry.email.toLowerCase();
    const inquiryFullName = inquiry.fullName.toLowerCase();

    return inquiryEmail.includes(query) || inquiryFullName.includes(query);
  });

  // Reset the current page to 1
  this.currentPage = 1;
},


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
    async getInquiry() {
  const inquiries = await axios.get(`/messages?limit=${this.limit}&page=${this.page}`)
    .then(res => res.data.data.items);
  this.inquiries = inquiries;
},
        async getOne(inquiry) {
            const findOneInquiry = await axios.get(`/messages/${inquiry._id}`).then(res => res.data.data)
            this.inquiry = await findOneInquiry
        }
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
        await this.getInquiry();
           // Fetch the initial user data
    await this.fetchInitialData();
    },
}
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
.inquiry-page {
  h1 {
    font-size: 24px;
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 90px;
  }
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