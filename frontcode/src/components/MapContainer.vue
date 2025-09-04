
<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

let map = null;
let userMarker = null;
let otherMarkers = [];
let fetchTimer = null;

// 上传自己位置
function uploadLocation(lng, lat, user_id) {
  fetch('/api/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, lng, lat })
  });
}


// 获取所有用户位置并渲染到地图（可选功能，保留接口）
// 获取所有用户位置并渲染到地图
function fetchAllLocations(myUserId) {
  fetch('/api/location')
    .then(res => res.json())
    .then(locations => {
      console.log('获取到的位置数据:', locations);
      
      // 清除之前的所有标记
      otherMarkers.forEach(m => map && map.remove(m));
      otherMarkers = [];
      
      // 为每个用户位置创建标记
      locations.forEach(loc => {
        if (loc.user_id !== myUserId) {
          const marker = new window.AMap.Marker({
            position: [parseFloat(loc.lng), parseFloat(loc.lat)], // 确保是数字类型
            title: loc.user_id,
            label: {
              content: loc.user_id,
              offset: new window.AMap.Pixel(10, 10)
            }
          });
          map && map.add(marker);
          otherMarkers.push(marker);
        }
      });
    })
    .catch(error => {
      console.error('获取位置信息失败:', error);
    });
}

// 点击按钮时上传位置
function handleUploadLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        if (userMarker) map.remove(userMarker);
        userMarker = new window.AMap.Marker({ position: [lng, lat], title: "你的位置" });
        map.add(userMarker);
        const user_id = localStorage.user_id || 'user_' + Math.random().toString(36).slice(2, 10);
        localStorage.user_id = user_id;
        uploadLocation(lng, lat, user_id);
        alert('位置已上传！');
      },
      (error) => {
        alert("定位失败：" + error.message);
      }
    );
  } else {
    alert("当前浏览器不支持定位功能");
  }
}

// 定时获取所有用户位置
function startFetchingLocations() {
  const user_id = localStorage.user_id || 'user_' + Math.random().toString(36).slice(2, 10);
  
  // 等待地图完全初始化
  const checkMapReady = setInterval(() => {
    if (map) {
      clearInterval(checkMapReady);
      // 立即获取一次
      fetchAllLocations(user_id);
      
      // 每10秒获取一次
      fetchTimer = setInterval(() => {
        fetchAllLocations(user_id);
      }, 10000);
    }
  }, 100);
}

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "ebf56b1ca59032ded98d268acb41a70c",
  };
  AMapLoader.load({
    key: "4011cf2cb0d9f7678cf1955058781295",
    version: "2.0",
    plugins: ["AMap.Scale"],
  })
    .then((AMap) => {
      map = new AMap.Map("container", {
        viewMode: "3D",
        zoom: 16.5,
        center: [120.3440, 30.3146],
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<template>
  <div id="container"></div>
  <button @click="handleUploadLocation" style="position: absolute; top: 20px; left: 20px; z-index: 1000;">上传我的位置</button>
</template>

<style scoped>
#container {
  width: 100%;
  height: 100vh;
}
</style>
