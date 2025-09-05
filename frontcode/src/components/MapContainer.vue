<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { fetchHeatmapData } from "../api/relitu";

let map = null;
const heatmapInstance = ref(null);
const heatmapVisible = ref(false);

async function initHeatmap(AMap) {
  console.log('initHeatmap 调用');
  let data = await fetchHeatmapData();
  console.log('fetchHeatmapData 返回:', data);
  if (!Array.isArray(data)) {
    console.error('热力图数据格式错误:', data);
    return;
  }

  // 转换为数字类型
  data = data.map(item => ({
    lng: Number(item.lng),
    lat: Number(item.lat),
    count: Number(item.count)
  }));
  console.log('热力图数据:', data); // 检查数据
  heatmapInstance.value = new AMap.HeatMap(map, {
    radius: 25,
    opacity: [0, 0.8],
    gradient: {
      0.5: 'blue',
      0.65: 'rgb(117,211,248)',
      0.7: 'rgb(0, 255, 0)',
      0.9: '#ffea00',
      1.0: 'red'
    }
  });
  heatmapInstance.value.setDataSet({ data, max: 10 });
  heatmapInstance.value.hide(); // 默认隐藏
  // 检查实例
  console.log('heatmapInstance:', heatmapInstance.value);
}

function toggleHeatmap() {
  if (!heatmapInstance.value || typeof heatmapInstance.value.hide !== 'function') {
    console.warn('热力图尚未初始化或方法不存在');
    return;
  }
  heatmapVisible.value = !heatmapVisible.value;
  if (heatmapVisible.value) {
    heatmapInstance.value.show();
  } else {
    heatmapInstance.value.hide();
  }
}
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
      
      // 为每个心情创建标记
      locations.forEach(loc => {
        // 判断是否为当前用户
        const isMe = loc.user_id === myUserId;
        const marker = new window.AMap.Marker({
          position: [parseFloat(loc.lng), parseFloat(loc.lat)],
          title: loc.content, // 标记标题为心情内容
          // label: {
          //   content: loc.content, // 标记标签显示心情内容
          //   offset: new window.AMap.Pixel(10, 10)
          // }
          icon: isMe
          ? 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png' // 当前用户用特殊图标
          : 'assets/mark_b.png', // 其他用户用普通图标
          opacity:0.7
        });
        // 双击显示心情内容和评价
        marker.on('dblclick', () => {
          const info = `
            <div>
              <strong>心情内容：</strong> ${loc.content}<br/>
              <strong>情绪分数：</strong> ${loc.sentiment_score}
            </div>
          `;
          const infoWindow = new window.AMap.InfoWindow({
            content: info,
            offset: new window.AMap.Pixel(0, -30)
          });
          infoWindow.open(map, marker.getPosition());
        });
        map && map.add(marker);
        otherMarkers.push(marker);
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
    key: "4011cf2cb0d9f7678cf1955058781295", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale", "AMap.HeatMap"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']，热力图插件
  })
    .then(async (AMap) => {
      map = new AMap.Map("container", {
        viewMode: "3D",
        zoom: 16.5,
        center: [120.3440, 30.3146],
      });
      await initHeatmap(AMap); // 初始化热力图
      startFetchingLocations(); // 启动定时获取所有用户位置
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
  <div>
    <!-- 按钮在热力图实例初始化前禁用 -->
    <button
      @click="toggleHeatmap"
      class="heatmap-toggle-btn"
      :disabled="!heatmapInstance"
    >
      {{ heatmapVisible ? '关闭热力图' : '显示热力图' }}
    </button>
    <button @click="handleUploadLocation" style="position: absolute; top: 20px; left: 20px; z-index: 1000;">上传我的位置</button>
    <div id="container"></div>
  </div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 100vh;
}
.heatmap-toggle-btn {
  position: absolute;
  top: 24px;
  right: 32px;
  z-index: 10;
  padding: 10px 24px;
  background: linear-gradient(90deg, #4f8cff 0%, #38e4ae 100%);
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 2px 12px rgba(79, 140, 255, 0.15);
  cursor: pointer;
  transition: background 0.3s, box-shadow 0.3s;
}
.heatmap-toggle-btn:hover {
  background: linear-gradient(90deg, #38e4ae 0%, #4f8cff 100%);
  box-shadow: 0 4px 24px rgba(56, 228, 174, 0.18);
}
</style>
