<script setup>
import { ref } from 'vue';

const isExpanded = ref(true);

const togglePanel = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div class="side-panel" :class="{ 'collapsed': !isExpanded }">
    <div class="panel-content" v-if="isExpanded">
      <!-- 收缩按钮 -->
      <button class="collapse-btn" @click="togglePanel">
        <span>←</span>
      </button>
      <button class="logout-btn" @click="logout">登出</button>
      <!-- 用户信息区域 -->
      <div class="user-info">
        <div class="avatar">
          <img src="@/assets/default-avatar.png" alt="用户头像">
        </div>
        <div class="nickname">用户昵称</div>
      </div>
      
      <!-- 心情记录列表 -->
      <div class="mood-list">
        <div class="mood-item" v-for="(item, index) in 3" :key="index">
          <div class="mood-emoji">😊</div>
          <div class="mood-text">记录{{ index + 1 }}</div>
          <div class="mood-delete">🗑️</div>
        </div>
      </div>
    </div>
    
    <!-- 展开按钮 -->
    <button v-if="!isExpanded" class="expand-btn" @click="togglePanel">
      <span>→</span>
    </button>
  </div>
</template>

<style scoped>
.side-panel {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  background-color: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s;
  width: 300px;
  z-index: 1000;
}

.side-panel.collapsed {
  width: 40px;
}

.panel-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.collapse-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.expand-btn {
  width: 100%;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  margin-bottom: 30px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nickname {
  font-size: 16px;
  font-weight: bold;
}

.mood-list {
  flex: 1;
  overflow-y: auto;
}

.mood-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.mood-emoji {
  margin-right: 10px;
  font-size: 20px;
}

.mood-text {
  flex: 1;
}

.mood-delete {
  cursor: pointer;
  opacity: 0.5;
}

.mood-delete:hover {
  opacity: 1;
}

.logout-btn{
  margin: 20px;
  position: fixed;
  top: 0;
  left: 180px;
  background: red;
  color: white;
  border-radius: 10px;
  width: 80px;
  height: 30px;
  border: none;
}
</style>