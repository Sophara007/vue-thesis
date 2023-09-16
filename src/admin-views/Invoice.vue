<template>
    <div class="order-page container-fluid">
        <h1>Customer invoice Report</h1>

        <div class="wrapper-table">
            <table class="table">
                <thead>
                    <tr style="text-align: center;">
                        <th scope="col">No</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Payment Method</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(order, index) in paginatedorders" :key="order._id" :class="getStatusClass(order.status)"
                        style="text-align: center;">
                        <th>{{ index + 1 }}</th>
                        <td>{{ order.orderId.userId.fullName }}</td>
                        <td>{{ order.price }} $</td>
                        <td>{{ mapPaymentMethod(order.orderId.paymentMethod) }}</td>
                        <td :class="getStatusClass(order.status)">
                            <span :class="getStatusTextClass(order.status)" style="font-weight: bold;">
                                {{ mapStatus(order.status) }}
                            </span>
                        </td>

                        <td>
                            <button class="btn btn-primary" @click="viewOrder(order)">
                                View
                            </button>
                            <!-- <button class="btn btn-success ml-2 text-white print-button bg-green-600 hover:bg-green-500 hover:text-white"
                            @click="generateAndPrintPDF">
                                Print
                            </button> -->

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
                    <h5 class="modal-title" id="viewModalLabel">Invoice Details</h5>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close" @click="closeViewModal">
                        <span class=" print-button" aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Display order details here -->
                    <div v-if="selectedOrder">
                        <p><strong>Customer Name:</strong> {{ selectedOrder.orderId.userId.fullName }}</p>
                        <p><strong>Payment Method:</strong> {{ mapPaymentMethod(selectedOrder.orderId.paymentMethod) }}</p>
                        <p><strong>Status:</strong> <span :class="getStatusTextClass(selectedOrder.status)"
                                style="font-weight: bold;">{{ mapStatus(selectedOrder.status) }}</span></p>
                        <p><strong>Phone Number:</strong> {{ selectedOrder.orderId.phoneNumber }}</p>
                        <p><strong>Email:</strong> {{ selectedOrder.orderId.userId.email }}</p>
                        <p><strong>Address:</strong> {{ selectedOrder.orderId.address }}</p>
                        <p><strong>Order ID:</strong> {{ selectedOrder.orderId._id }}</p>
                        <p><strong>Invoice ID:</strong> {{ selectedOrder._id }}</p>
                        <hr>
                        <p><strong>Item:</strong> {{ selectedOrder.orderId.subProductId.title }}</p>
                        <p><strong>Price:</strong> {{ selectedOrder.price }}<span> $</span></p>
                    </div>
                </div>
                <div class="modal-footer">
                    
                    <button v-if="selectedOrder && selectedOrder.status !== 3"
        class="btn btn-success bg-green-600 hover:bg-green-700 print-button"
        @click="generateAndPrintPDF">Print PDF</button>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const logoImageURL = 'https://static.wixstatic.com/media/4ec883_1768ba30e5b14ff28e8f5cdfc17de94a~mv2.png/v1/crop/x_0,y_121,w_505,h_279/fill/w_318,h_170,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/bt-i%20logo%20-%20white%20background%20-%20single%20color%20-%20shaded%20500%20x%20500.png';
export default {
    data() {
        return {
            orders: [], 
            currentPage: 1,
      itemsPerPage: 10,
      limit: 1000, // Default limit
      page: 1,   // Default page

            selectedOrder: null,
        };
    },
    computed: {
    paginatedorders() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
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
        axios.get(`/reports?limit=${this.limit}&page=${this.page}`) // Replace with your API endpoint
  .then(response => {
    this.orders = response.data.data.items; // Assuming 'items' contains the list of orders
  })
  .catch(error => {
    console.error('Error fetching data', error);
  });

    },
    methods: {
        setCurrentPage(page) {
      this.currentPage = page;
    },
        printInvoice() {
            // Trigger the print action
            window.print();
        },
        generateAndPrintPDF() {
  if (this.selectedOrder) {
    // Create a new PDF document
    const pdf = new jsPDF();

    // Set the font size and style for the content
    pdf.setFontSize(14);
    pdf.setFont('Arial', 'normal');

    // Get the current date
    const currentDate = new Date().toLocaleDateString();

    // Create an array for the table data
    const tableData = [
      ['Description', 'Quantity', 'Unit Price', 'Total'],
      [this.selectedOrder.orderId.subProductId.title, '1', this.selectedOrder.price + ' $', this.selectedOrder.price + ' $'],
    ];

    // Define the columns for the table
    const tableColumns = {
      startY: 100, // Adjust the starting Y position
      head: [['Item Description', 'Quantity', 'Unit Price', 'Total']],
      body: tableData.slice(1), // Exclude the header from the body
      styles: {
        cellWidth: 'auto',
        fontSize: 12,
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        3: { halign: 'right' },
      },
    };

    // Calculate the total amount
    const totalAmount = this.selectedOrder.price;

    // Add a header
    pdf.setFontSize(18);
    pdf.text('Invoice', 105, 20, null, null, 'center');

    // Load the logo image
    const logoWidth = 24; // Set the width of the logo
    const logoHeight = 12; // Set the height of the logo
    pdf.addImage(logoImageURL, 'PNG', 10, 10, logoWidth, logoHeight); // Adjust the position and size as needed
    // Add the current date
    pdf.setFontSize(12);
    pdf.text(`Date: ${currentDate}`, 10, 30);

    // Add customer details
    pdf.setFontSize(12);
    pdf.text(`Customer Name: ${this.selectedOrder.orderId.userId.fullName}`, 10, 40);
    pdf.text(`Phone Number: ${this.selectedOrder.orderId.phoneNumber}`, 10, 50);
    pdf.text(`Email: ${this.selectedOrder.orderId.userId.email}`, 10, 60);
    pdf.text(`Address: ${this.selectedOrder.orderId.address}`, 10, 70);
    pdf.text(`Payment Method: ${this.mapPaymentMethod(this.selectedOrder.orderId.paymentMethod)}`, 10, 80);
    pdf.text(`Status: ${this.mapStatus(this.selectedOrder.status)}`, 10, 90);

    // Add Order ID and Invoice ID at the top right
    pdf.setFontSize(12);
    pdf.text(`Order ID: ${this.selectedOrder.orderId._id}`, 125, 30); // Further adjusted X-coordinate
    pdf.text(`Invoice ID: ${this.selectedOrder._id}`, 125, 40); // Further adjusted X-coordinate

    // Add the table to the PDF
    pdf.autoTable(tableColumns);

    // Add the total amount
    pdf.setFontSize(14);
    pdf.text(`Total Amount: ${totalAmount} $`, 10, pdf.autoTable.previous.finalY + 20);

    // Add a thank you message
    pdf.setFontSize(12);
    pdf.text('Thank you for your purchase!', 10, pdf.autoTable.previous.finalY + 30);

    // Save or print the PDF
    pdf.save('invoice.pdf');
  }
},


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
.print-button {
    display: inline-block;
}

@media print {
    .print-button {
        display: none;
    }
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
}
</style>
  