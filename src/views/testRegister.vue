<template>
  <h1>Register</h1>

  <p>email</p>
  <input type="text" v-model="form.email" />

  <p>username</p>
  <input type="text" v-model="form.fullName" />

  <p>password</p>
  <input type="text" v-model="form.password" />

  <button @click="OnRegister">register</button>

  {{ hey }}
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "hongly@gmail.com",
        fullName: "hongly",
        password: "12345678",
      },
    };
  },
  methods: {
    async OnRegister() {
        const response = await this.$axios.post("http://172.16.9.173:3000/users/register", this.form).then(res=> console.log(res));
    },
  },
};
</script>

<style>
h1 {
  margin-top: 50px;
}
</style>
