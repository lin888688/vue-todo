<template data-bs-theme="auto">
  <form class="form-signin">
    <h1 class="h3 mb-3 fw-normal">登入</h1>
    <div class="form-floating">
      <input
        type="text"
        class="form-control"
        id="floatingInput"
        placeholder="Name"
        name="name"
        v-model="name"
        required
      />
      <label for="floatingInput">Name</label>
    </div>
    <br />
    <div class="form-floating">
      <input
        type="password"
        class="form-control"
        id="floatingPassword"
        placeholder="Password"
        name="password"
        v-model="password"
        required
      />
      <label for="floatingPassword">Password</label>
    </div>

    <div class="form-check text-start my-3">
      <input class="form-check-input" type="checkbox" id="flexCheckDefault" @click="myFunction()" />
      <label class="form-check-label" for="flexCheckDefault"> 顯示密碼 </label>
    </div>

    <button class="btn btn-primary" type="button" @click="onSignIn">登入</button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Swal from 'sweetalert2';

const router = useRouter();
const { setUserInfo } = useUserStore();

const name = ref();
const password = ref();

const onSignIn = () => {
  if (!name.value || !password.value) {
    Swal.fire({
      text: '請輸入完整姓名和密碼!',
      icon: 'error',
      allowOutsideClick: false,
      confirmButtonText: '確認'
    });
  } else {
    const request = ref({
      name: name.value,
      password: password.value
    });
    setUserInfo(request.value);
    router.push({ name: 'list' });
  }
};

function myFunction() {
  var x = document.getElementById('floatingPassword');
  if (x.type === 'password') {
    x.type = 'text';
  } else {
    x.type = 'password';
  }
}
</script>

<style scoped>
.form-signin {
  margin: auto;
  margin-top: 10%;
  width: 20%;
}
</style>
