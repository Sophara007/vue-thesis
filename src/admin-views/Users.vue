<template>
    <div class="users-page container-fluid">
        <h1>Customer Page</h1>

        <div
            class="d-flex justify-content-between align-items-center mb-3 mt-5"
        >
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
                <div
                    class="input-group input-group-sm"
                    style="max-width: 200px"
                >
                    <input
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="Search"
                        v-model="searchEmail"
                    />
                </div>
                <button
                    class="btn btn-sm btn-primary"
                    @click="searchOrderByEmail"
                >
                    <i class="fas fa-search"></i>
                    <!-- Font Awesome search icon -->
                </button>
                <button class="btn btn-sm btn-secondary" @click="resetSearch">
                    Reset
                </button>
            </div>
        </div>

        <div class="wrapper-table">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Full Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Ballance</th>
                        <th scope="col">Registered Date</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in paginatedusers" :key="user.id">
                        <th>
                            {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                        </th>
                        <td>{{ user.fullName }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.ballance }} $</td>
                        <td>{{ formatDate(user.createdAt) }}</td>
                        <td>
                            <div class="wrapper-action">
                                <!-- <button class="btn btn-info" @click="viewUserDetails(user)">
                  View
                </button> -->
                                <button
                                    class="btn btn-info"
                                    @click="getUserById(user._id)"
                                >
                                    View
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Only show pagination if there are more than 10 items -->
        <div class="pagination-container" v-if="users.length > 10">
            <ul class="pagination">
                <li class="page-item">
                    <button
                        class="page-link"
                        @click="currentPage -= 1"
                        :disabled="currentPage === 1"
                    >
                        &#8592; Previous
                    </button>
                </li>

                <li v-for="page in visiblePages" :key="page">
                    <button
                        class="page-link"
                        @click="currentPage = page"
                        :class="{ active: currentPage === page }"
                    >
                        {{ page }}
                    </button>
                </li>
                <li class="page-item">
                    <button
                        class="page-link"
                        @click="currentPage += 1"
                        :disabled="currentPage === totalPages"
                    >
                        Next &#8594;
                    </button>
                </li>
            </ul>
        </div>

        <!-- User Details Modal -->
        <div
            class="modal fad"
            id="userDetailsModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="userDetailsModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userDetailsModalLabel">
                            {{
                                selectedUser
                                    ? selectedUser.fullName + " Information"
                                    : ""
                            }}
                        </h5>
                    </div>
                    <div class="modal-body">
                        <div v-if="selectedUser">
                            <div class="mb-4 mt-1">
                                <strong>Full Name:</strong>
                                {{ selectedUser.fullName }} <br /><br/>
                                <strong>Email:</strong> {{ selectedUser.email }}
                                <br /> <br/>
                                <strong>Phone Number:</strong>
                                {{ selectedUser.phoneNumber }} <br /><br/>
                                <strong>Address:</strong>
                                {{ selectedUser.address }} <br /><br/>
                                <strong>Ballance:</strong>
                                {{ selectedUser.ballance }} $
                                <br/>
                            </div>
                            <hr />
                            <!-- Order History -->

                            <h4 class="py-2 text-center mt-3">
                                <strong>Order History</strong>
                            </h4>
                            <br />
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Title</th>

                                        <th>Status</th>
                                        <th class="text-center">Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="order in orders"
                                        :key="order._id"
                                    >
                                        <td>{{ order.subProductId.title }}</td>

                                        <td>
                                            {{
                                                order.status === 1
                                                    ? "Pending"
                                                    : order.status === 2
                                                    ? "Agreed"
                                                    : order.status === 3
                                                    ? "Rejected"
                                                    : "Unknown"
                                            }}
                                        </td>
                                        <td>
                                            <img
                                                :src="
                                                    order.subProductId.image.url
                                                "
                                                alt="Product Image"
                                                style="
                                                    max-width: 100px;
                                                    max-height: 100px;
                                                "
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary bg-red-500 hover-bg-red-600 text-white"
                            data-bs-dismiss="modal"
                            @click="closeViewModal"
                        >
                            Close
                        </button>
                    </div>
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
            users: [], // Changed to 'users'
            selectedUser: null,
            orders: [],
            currentPage: 1,
            itemsPerPage: 10,
            searchEmail: "",
            limit: 1000, // Default limit
            page: 1, // Default page
        };
    },
    computed: {
        paginatedusers() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + parseInt(this.itemsPerPage); // Parse the selected itemsPerPage
            return this.users.slice(startIndex, endIndex); // Updated to use 'users' data
        },
        totalPages() {
            return Math.ceil(this.users.length / this.itemsPerPage); // Updated to use 'users' data
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
                } else if (
                    this.currentPage >=
                    this.totalPages - maxVisiblePages + 3
                ) {
                    pages.push(1);
                    pages.push(2);
                    pages.push("...");
                    for (
                        let i = this.totalPages - maxVisiblePages + 3;
                        i <= this.totalPages;
                        i++
                    ) {
                        pages.push(i);
                    }
                } else {
                    pages.push(1);
                    pages.push(2);
                    pages.push("...");
                    for (
                        let i = this.currentPage - 1;
                        i <= this.currentPage + 1;
                        i++
                    ) {
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
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false, // 24-hour format
            };
            return date.toLocaleDateString("en-US", options);
        },
        resetSearch() {
            // Clear the search input
            this.searchEmail = "";

            // Fetch the initial data again to reset the list
            this.fetchInitialData();
        },

        fetchInitialData() {
            // Fetch data from your API and update the 'users' and 'originalUsers' arrays
            axios
                .get(`/users?limit=${this.limit}&page=${this.page}`)
                .then((response) => {
                    this.users = response.data.data.items;
                    this.originalUsers = response.data.data.items; // Initialize originalUsers
                })
                .catch((error) => {
                    console.error("Error fetching data", error);
                });
        },
        searchOrderByEmail() {
    const keywordToSearch = this.searchEmail.trim().toLowerCase();

    if (!keywordToSearch) {
        // Handle empty search input as needed
        this.users = this.originalUsers; // Reset to the original list
        this.currentPage = 1; // Reset the current page to 1
        return;
    }

    // Filter the users based on email, full name, and phone number in the originalUsers list
    this.users = this.originalUsers.filter((user) => {
        const userMail = user.email ? user.email.toLowerCase() : "";
        const fullName = user.fullName ? user.fullName.toLowerCase() : "";
        const phoneNumber = user.phoneNumber ? user.phoneNumber.toLowerCase() : "";

        // Check if any part of the user's information includes the search keyword
        return (
            userMail.includes(keywordToSearch) ||
            fullName.includes(keywordToSearch) ||
            phoneNumber.includes(keywordToSearch)
        );
    });

    // Reset the current page to 1
    this.currentPage = 1;
},



        setCurrentPage(page) {
            this.currentPage = page;
        },
        async getUser() {
            const users = await axios
                .get(`/users?limit=${this.limit}&page=${this.page}`) // Updated URL
                .then((res) => res.data.data.items);
            this.users = users;
        },
        viewUserDetails(user) {
            this.selectedUser = user;
            // Trigger the Bootstrap modal to show
            $("#userDetailsModal").modal("show");
        },
        // get user by Id
        async getUserById(userId) {
            const users = await axios
                .get(`/users/${userId}`) // Updated URL
                .then((res) => (this.selectedUser = res.data.data));

            // get order
            await axios
                .get(`/order/getOrder/${userId}`) // Updated URL
                .then((res) => (this.orders = res.data.data));

            $("#userDetailsModal").modal("show");
        },
    },
    async mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        const limitParam = urlParams.get("limit");
        const pageParam = urlParams.get("page");

        // Update limit and page with query parameter values if provided
        if (limitParam) {
            this.limit = parseInt(limitParam);
        }
        if (pageParam) {
            this.page = parseInt(pageParam);
        }
        await this.getUser();
        // Fetch the initial user data
        await this.fetchInitialData();
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
.users-page {
    h1 {
        font-size: 24px;
        font-weight: bold;
        text-transform: uppercase;
        margin-bottom: 90px;
    }
}
</style>
