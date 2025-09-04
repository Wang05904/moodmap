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
        v-model="inputContent"
        placeholder="请输入内容"
        class="input-textarea"
      ></textarea>
      <button
        @click="sendContent"
        class="send-btn"
      >
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

// 控制输入框显示隐藏
const isInputVisible = ref(false);
// 输入框内容
const inputContent = ref('');
// 定位信息
const location = ref({});

// 鼠标悬浮显示输入框
const showInput = () => {
  isInputVisible.value = true;
};

// 鼠标离开隐藏输入框（可选，根据需求决定是否需要）
const hideInput = () => {
  isInputVisible.value = false;
};

// 发送内容到后端
const sendContent = async () => {
  if (!inputContent.value.trim()) {
    ElMessage.warning('请输入内容');
    return;
  }

  try {
    // 获取 sessionStorage 中的 username
    const username = sessionStorage.getItem('username');
    if (!username) {
      ElMessage.error('未获取到用户名');
      return;
    }

    // 调用后端接口
    
  } catch (error) {
    console.error('发送失败:', error);
    ElMessage.error('发送异常');
  }
};

// 初始化高德地图并获取定位
onMounted(() => {
  // 加载高德地图 SDK（需要先在 index.html 中引入，或者通过动态加载）
  // 示例：在 index.html 中添加 
  if (window.AMap) {
    const AMap = window.AMap;
    AMap.plugin('AMap.Geolocation', () => {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位
        timeout: 10000, // 超时时间
      });

      geolocation.getCurrentPosition((status, result) => {
        if (status === 'complete') {
          // 获取到定位信息
          location.value = {
            latitude: result.position.lat,
            longitude: result.position.lng,
            address: result.formattedAddress,
          };
        } else {
          ElMessage.warning('获取定位失败');
          console.error('获取定位失败:', result);
        }
      });
    });
  } else {
    ElMessage.error('高德地图 SDK 加载失败');
  }
});
</script>

<style scoped>
.input-container {
  display: flex;
  align-items: center;
  position: relative;
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
  left: -200px;
  top: -10px;
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