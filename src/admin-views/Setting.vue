<template>
  <div class="wrapper-setting-page container-fluid">
    <h1>Setting Information</h1>
    <div class="wrapper-form mt-5">
      <div class="wrapper-form-input">
        <input
          type="text"
          class="form-control"
          placeholder="Address"
          v-model="form.address"
        />
        <input
          type="text"
          class="form-control mt-3"
          placeholder="Phone Number"
          v-model="form.phoneNumber"
        />
        <input
          type="text"
          class="form-control mt-3"
          placeholder="Telegram"
          v-model="form.telegram"
        />
        <input
          type="text"
          class="form-control mt-3"
          placeholder="Email"
          v-model="form.companyEmail"
        />
        
      </div>
      <button type="button" class="btn btn-success mt-5" @click="onUpdate">
            Update
          </button>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      form: {
        address: "",
        phoneNumber: "",
        telegram: "",
        companyEmail: "",
      }
    }
  },
  methods:{
    async getCompanyInfo(){
        const info = await axios.get('/company-info').then(res=> res.data)
        this.form = info
    },
    async onUpdate(){
        const result = await axios.put('/company-info' , this.form)
        console.log(this.form)
        console.log('result >>>',result)
    }
  },
  async mounted() {
    await this.getCompanyInfo();
  },
  
};
</script>

<style lang="scss" scoped>
    .btn {
      color: green;

      &:hover {
        color: white;
      }
    }</style>