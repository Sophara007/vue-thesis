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
                    <tr v-for="(order, index) in orders" :key="order._id" :class="getStatusClass(order.status)"
                        style="text-align: center;">
                        <th>{{ index + 1 }}</th>
                        <td>{{ order.orderId.fullName }}</td>
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
                        <p><strong>Customer Name:</strong> {{ selectedOrder.orderId.fullName }}</p>
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
                    
                    <button class="btn btn-success bg-green-600 hover:bg-green-700 print-button" @click="generateAndPrintPDF">Print PDF</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import jsPDF from 'jspdf';
export default {
    data() {
        return {
            orders: [], 

            selectedOrder: null,
        };
    },
    created() {
        axios.get('/reports') // Replace with your API endpoint
            .then(response => {
                this.orders = response.data.data.items; // Assuming 'items' contains the list of orders
            })
            .catch(error => {
                console.error('Error fetching data', error);
            });
    },
    methods: {
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

    // Define the content of the PDF with the current date
    const content = `
      Blue-Technology
      Invoice Details
      ----------------------------
      Date: ${currentDate}
      Customer Name: ${this.selectedOrder.orderId.fullName}
      Payment Method: ${this.mapPaymentMethod(this.selectedOrder.orderId.paymentMethod)}
      Status: ${this.mapStatus(this.selectedOrder.status)}
      Phone Number: ${this.selectedOrder.orderId.phoneNumber}
      Email: ${this.selectedOrder.orderId.userId.email}
      Address: ${this.selectedOrder.orderId.address}
      Order ID: ${this.selectedOrder.orderId._id}
      Invoice ID: ${this.selectedOrder._id}
      
      Item: ${this.selectedOrder.orderId.subProductId.title}
      Price: ${this.selectedOrder.price} $

      -----------------------------------
      Thank you for your purchase!
    `;

    // Add the content to the PDF with proper line spacing
    pdf.text(content, 10, 10);

    // Print the PDF in a new window
    pdf.autoPrint();
    pdf.output('dataurlnewwindow');
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
};
</script>
  
<style lang="scss" scoped>
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
  