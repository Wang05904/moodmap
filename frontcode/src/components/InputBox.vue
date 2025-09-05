<template>
  <div class="input-container">
    <!-- 右侧 icon，鼠标悬浮显示输入框 -->
    <div
      class="icon"
      @mouseenter="showInput"
      @mouseleave="hideInput"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" />
        <circle cx="9" cy="10" r="1" fill="black" />
        <circle cx="15" cy="10" r="1" fill="black" />
        <circle cx="9" cy="14" r="1" fill="black" />
        <circle cx="15" cy="14" r="1" fill="black" />
        <path
          d="M10 16H14"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>

    <!-- 输入框，根据 isInputVisible 控制显示隐藏 -->
    <div
      v-show="isInputVisible"
      class="input-box"
    >
      <textarea
        v-model="moodData.content"
        placeholder="请输入内容"
        class="input-textarea"
      ></textarea>
      <button
        @click="sendContent"
        class="send-btn"
        :style="{ 'background-color': isloading ? 'gray' : '#409eff' }"
      >
        {{ isloading ? '发送中...' : '发送' }}

      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {sendRcd} from '@/api/record'; 
import { useRcdStore } from '@/stores/rcdStore'
const rcdStore = useRcdStore()
const isloading = ref(false);
const myRcd = ref([]);
// 控制输入框显示隐藏
const isInputVisible = ref(false);
//情绪信息
const moodData = ref({
  userId: sessionStorage.getItem('userId'),
  content: '',
  latitude: 1,
  longitude: 2
});
// 鼠标悬浮显示输入框
const showInput = () => {
  isInputVisible.value = true;
};
//获取自己的记录
onMounted(() => {
  rcdStore.initRcdList()
})
// 发送内容到后端
const sendContent = async () => {
    console.log(moodData.value);
    isloading.value = true;
    try{
      const result = await sendRcd(moodData.value)
    rcdStore.initRcdList()
  }catch(error){
    ElMessage.error('发送失败');
  }
  moodData.value.content = '';
  isloading.value = false;
};

</script>

<style scoped>
.input-container {
  position: fixed;
  right: 10px;
  bottom: 50px;
  display: flex;
  align-items: center;
  z-index: 1000;
}

.icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.input-box {
  position: absolute;
  right: 10px;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-textarea {
  width: 200px;
  height: 80px;
  resize: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px;
  margin-bottom: 8px;
}

.send-btn {
  align-self: flex-end;
  padding: 4px 12px;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>