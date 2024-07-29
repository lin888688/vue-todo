import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

// 定義 store
export const useUserStore = defineStore(
  'user',
  () => {
    // status
    const userInfo = ref(null);

    // getter
    const loginUser = computed(() => (userInfo.value ? userInfo.value.name : null));
    // action 請使用 function 修改 status
    const setUserInfo = (data) => {
      userInfo.value = data;
    };

    return { userInfo, loginUser, setUserInfo };
  },
  {
    persist: true
  }
);
