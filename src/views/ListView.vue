<template>
  <div class="row" style="margin-top: 60px">
    <button style="margin-bottom: 30px; border-radius: 5px" @click="logOut">登出</button>
    <div class="col-sm-4 mb-3 mb-sm-0" style="margin-right: 16%">
      <div class="card">
        <div class="card-body">
          <div class="col-md-12">
            <h3>待辦事項</h3>
            <hr />
          </div>
          <div class="row">
            <div class="col-md-12">
              <form class="container">
                <div class="form-group">
                  <label class="col-6 col-form-label">姓名:</label>
                  <div class="col-12">
                    <input class="form-control here" type="text" v-model="data.name" disabled />
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-4 col-form-label">待辦標題:</label>
                  <div class="col-12">
                    <input class="form-control here" type="text" v-model="data.title" />
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-4 col-form-label">待辦內容:</label>
                  <div class="col-12">
                    <textarea class="form-control here" v-model="data.todoContent"></textarea>
                  </div>
                </div>
                <button class="btn btn-secondary col-12" type="button" @click="submit">送出</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-sm-6 mb-3 mb-sm-0">
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio1"
          @click="check(false)"
          checked
        />
        <label class="form-check-label" for="inlineRadio1">查看全部</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio2"
          @click="check(true)"
        />
        <label class="form-check-label" for="inlineRadio2">只看自己</label>
      </div>
      <div v-for="todo in userData" :key="todo.todoId">
        <div class="card border-secondary mb-3">
          <div class="card-header d-flex justify-content-between" style="font-size: 25px">
            <div>
              <img
                v-if="todo.isComplete == 'Y'"
                src="/check-circle-fill.svg"
                style="width: 20px; margin-right: 5px"
              />
              <img v-else src="/info-circle.svg" style="width: 20px; margin-right: 5px" />
              {{ todo.name }}
            </div>
            <div v-if="todo.isComplete == 'Y'" style="padding-left: 5%; font-weight: normal">
              已完成 | {{ formatDate(todo.completeTime) }}
            </div>
            <div v-else>未完成</div>
          </div>
          <div class="card-body text-secondary">
            <h3 class="card-title" style="color: #4f4f4f">{{ todo.title }}</h3>
            <p class="card-text">{{ todo.todoContent }}</p>
          </div>
          <div
            v-if="todo.name === loginUser"
            class="d-grid gap-2 d-md-flex justify-content-md-end"
            style="margin-right: 20px"
          >
            <button
              v-if="todo.isComplete == 'N'"
              class="btn btn-outline-secondary"
              type="button"
              @click="update(todo.todoId)"
            >
              完成
            </button>
            <button class="btn btn-outline-secondary" type="button" @click="modify(todo)">
              編輯
            </button>
            <button class="btn btn-outline-secondary" type="button" @click="remove(todo.todoId)">
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import axios from '@/plugins/axios.js';
import Swal from 'sweetalert2';

const router = useRouter();

const { userInfo, loginUser } = storeToRefs(useUserStore());

const data = ref({
  name: loginUser,
  title: '',
  todoContent: ''
});

const resetForm = () => {
  data.value = {
    name: loginUser,
    title: '',
    todoContent: ''
  };
  modifyData.value = false;
  todoId.value = null;
};

const allData = ref([]);
const modifyData = ref(false);
const todoId = ref(null);
const checkTodo = ref(false);

const logOut = () => {
  Swal.fire({
    title: '登出成功!',
    icon: 'success'
  });
  localStorage.clear();
  router.push({ name: 'signIn' });
};

const submit = async () => {
  try {
    if (modifyData.value) {
      await axios.put(`UpdateTodoContent/${todoId.value}`, data.value);
    } else {
      await axios.post('InsertTodo', data.value);
    }
    await findAll();
    resetForm();
  } catch (error) {
    console.error(error);
  }
};

const formatDate = (date) => {
  if (date.includes('T')) {
    return date.split('T')[0] + ' ' + date.split('T')[1].split('.')[0];
  } else {
    return date;
  }
};

const findAll = async () => {
  try {
    const response = await axios.get('Get');
    allData.value = [...response.data.returnData];
  } catch (error) {
    console.error(error);
  }
};

const check = (value) => {
  checkTodo.value = value;
};

const userData = computed(() => {
  if (!checkTodo.value) {
    return allData.value;
  }
  return allData.value.filter((todo) => {
    return todo.name === loginUser.value;
  });
});

const update = async (todoId) => {
  try {
    await axios.put(`UpdateTodoStatus/${todoId}`, {
      todoId: todoId,
      isComplete: 'Y'
    });
    await findAll();
  } catch (error) {
    console.error(error);
  }
};

const remove = async (todoId) => {
  try {
    await axios.delete(`Delete/${todoId}`);
    await findAll();
  } catch (error) {
    console.error(error);
  }
};

const modify = (todo) => {
  data.value = {
    todoId: todo.todoId,
    name: todo.name,
    title: todo.title,
    todoContent: todo.todoContent
  };
  modifyData.value = true;
  todoId.value = todo.todoId;
};

onMounted(() => {
  findAll();
});
</script>

<style scoped>
.row {
  width: 80%;
  margin: auto;
}
button {
  margin-bottom: 10px;
}
.btn-secondary {
  margin-top: 20px;
}
.form-control {
  background-color: rgb(238, 238, 238);
}
label {
  font-size: 20px;
}
</style>
