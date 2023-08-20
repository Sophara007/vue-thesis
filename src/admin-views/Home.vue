<template>
    <div class="home-page container-fluid">
        <h1>HomePage</h1>
        <div class="row mt-5">
            <div class="col-sm-4 card rounded-top flex-column justify-content-center align-items-center p-5">
                <i class="fa-brands fa-product-hunt mr-5 m-3"></i>
                <p class="total">{{ data.count_product }}</p>
                <p class="title">Products</p>
            </div>
            <div class="col-sm-4 card rounded-top flex-column justify-content-center align-items-center p-5">
                <i class="fas fa-handshake align-middle mr-5 m-3"></i>
                <p class="total">{{ data.count_service }}</p>
                <p class="title">Services</p>
            </div>
            <div class="col-sm-4 card rounded-top flex-column justify-content-center align-items-center p-5">
                <i class="fas fa-users mr-5 m-3"></i>
                <p class="total">{{ data.count_user }}</p>
                <p class="title">Users</p>
            </div>
            <div class="col-sm-4 card rounded-top flex-column justify-content-center align-items-center p-5">
                <i class="fa fa-commenting mr-5 m-3"></i>
                <p class="total">{{ data.count_inquiry }}</p>
                <p class="title">Inquiries</p>
            </div>
            <div class="col-sm-4 card rounded-top flex-column justify-content-center align-items-center p-5 ">
                <i class="fa-regular fa-window-restore mr-5 m-3"></i>
                <p class="total">{{ data.count_partner }}</p>
                <p class="title">Partners</p>
            </div>
            <div class="col-sm-4 card rounded-top flex-column justify-content-center align-items-center p-5">
                <i class="fas fa-industry mr-5 m-3"></i>
                <p class="total">{{ data.count_industry }}</p>
                <p class="title">Industies</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            data: {
                count_product: '',
                count_service: '',
                count_user: '',
                count_inquiry: '',
                count_partner: '',
                count_industry: ''
            }
        }
    },
    methods:{
        async getDashboard(){
            const dashboard = await axios.get('/dashboard').then(res=> res.data.data)
             this.data = dashboard
        }
    },
    async mounted(){
        await this.getDashboard()
    }
}
</script>

<style scoped>
  h1 {
    font-size: 24px;
    font-weight: bold;
    text-transform: uppercase;
  }
i {
    font-size: 40px;
}
.total {
    font-size: 30px;
}
.title {
    color: rgb(71, 71, 71);
}
</style>
