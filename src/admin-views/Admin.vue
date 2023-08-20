<template>
    <div class="admin-setting container-fluid border-2 rounded-3 p-5">
        <h1>Admin Setting</h1>
        <div class="wrapper-info mt-5 mb-4">
            <p>Name : Admin</p>
            <p>Email : admin@drtech.com</p>
        </div><hr>
        <div class="wrapper-form">
            <p class="mt-4">Update Password</p>
            <input type="password" class="form-control mt-3 w-25" placeholder="Old Password"> <br>
            <input type="password" class="form-control w-25" placeholder="New Password"> <br>
            <button type="button" class="btn btn-success">Update</button>
        </div>
    </div>
</template>

<style scoped>
    .btn {
        color: green;
    }
    .btn:hover {
        color: white;
    }
    h1 {
        font-size: 20px;
        font-weight: bold;
    }
</style>
