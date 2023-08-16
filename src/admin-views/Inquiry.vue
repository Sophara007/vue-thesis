<template>
    <div class="inquiry-page container-fluid">
        <h1> Inquiry page</h1>



        <div class="wrapper-table mt-5">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">N0</th>
                        <th scope="col">Full Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">subject</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(inquiry, index) in inquiries" :key="inquiry.index">
                        <th>{{ index + 1 }}</th> <!-- Change this line -->
                        <td>{{ inquiry.fullName }}</td>
                        <td>
                            {{ inquiry.email }}
                        </td>
                        <td>
                            {{ inquiry.subject }}
                        </td>
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
                        <h6>From : {{ inquiry.fullName }}</h6>
                        <h6>Email : {{ inquiry.email }}</h6>
                        <h6>Promotion Code : {{ inquiries.promotionCode }}</h6>
                        <br>
                        <h6>Subject : {{ inquiry.subject }}</h6>
                        <p>{{ inquiry.message }}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success">
                        Close
                    </button>
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
            inquiries: [],
            inquiry: {}
        }
    },
    methods: {
        async getInquiry() {
            const inquiries = await axios.get('/messages?limit=100&sortField=_id').then(res => res.data.data.items)
            this.inquiries = inquiries
        },
        async getOne(inquiry) {
            const findOneInquiry = await axios.get(`/messages/${inquiry._id}`).then(res=> res.data.data)
            this.inquiry = await findOneInquiry
        }
    },
    async mounted() {
        await this.getInquiry();
    },
}


</script>
<style lang="scss" scoped>
.inquiry-page {
    h1 {
        font-size: 24px;
        font-weight: bold;
        text-transform: uppercase;
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