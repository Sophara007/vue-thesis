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
                        <td>{{ order.fullName }}</td>
                        <td>{{ order.subProductId.price }} $</td>
                        <td>{{ mapPaymentMethod(order.paymentMethod) }}</td>
                        <td :class="getStatusClass(order.status)">
                            <span :class="getStatusTextClass(order.status)" style="font-weight: bold;">
                                <span v-if="!order.isEditing" @click="startEditingStatus(order)">
                                    {{ mapStatus(order.status) }}
                                    <i class="fa fa-pencil ml-2" style="cursor: pointer;"></i> <!-- Edit icon -->
                                </span>
                                <span v-else>
                                    <!-- Use a div with a class for styling instead of the select element -->
                                    <div class="status-dropdown-sm">
                                        <select v-model="order.newStatus" class="form-select form-select-sm">
                                            <option value="1">Pending</option>
                                            <option value="2">Agreed</option>
                                            <option value="3">Rejected</option>
                                        </select>
                                    </div>
                                    <button class="btn btn-primary btn-sm smaller-btn"
                                        @click="updateStatus(order)">Save</button>
                                    <button class="btn btn-secondary btn-sm smaller-btn"
                                        @click="cancelEditingStatus(order)">Cancel</button>
                                </span>
                            </span>
                        </td>

                        <td>
                            <button class="btn btn-primary" @click="viewOrder(order)">
                                View
                            </button>
                            <button class="btn btn-success ml-2 text-white bg-green-600 hover:bg-green-500 hover:text-white"
                                @click="viewOrder(order)">
                                Print
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
                        <p><strong>Order ID:</strong> {{ selectedOrder._id }}</p>
                        <p><strong>Customer Name:</strong> {{ selectedOrder.fullName }}</p>
                        <p><strong>Payment Method:</strong> {{ mapPaymentMethod(selectedOrder.paymentMethod) }}</p>
                        <p><strong>Status:</strong> <span :class="getStatusTextClass(selectedOrder.status)"
                                style="font-weight: bold;">{{ mapStatus(selectedOrder.status) }}</span></p>
                        <p><strong>phoneNumber:</strong> {{ selectedOrder.phoneNumber }}</p>
                        <p><strong>Email:</strong> {{ selectedOrder.userId.email }}</p>
                        <p><strong>address:</strong> {{ selectedOrder.address }}</p>
                        <hr>
                        <p><strong>Item:</strong> {{ selectedOrder.subProductId.title }}</p>
                        <p><strong>Price:</strong> {{ selectedOrder.subProductId.price }}<span> $</span></p>
                        <img v-if="selectedOrder.subProductId && selectedOrder.subProductId.image && selectedOrder.subProductId.image.url"
                            :src="selectedOrder.subProductId.image.url" class="subProduct-img img-fluid"
                            :alt="selectedOrder.subProductId.title" />
                        <!-- Add more order details here as needed -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary bg-red-500 hover:bg-red-600 text-white"
                        data-bs-dismiss="modal" @click="closeViewModal">Close</button>
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

        cancelEditingStatus(order) {
            // Reset the isEditing property to false
            order.isEditing = false;

            // Optionally, you can revert the newStatus to the original status
            // This step is optional and depends on your use case
            order.newStatus = order.status;
        },
        startEditingStatus(order) {
            order.isEditing = true;
            order.newStatus = order.status; // Initialize newStatus with the current status
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
  