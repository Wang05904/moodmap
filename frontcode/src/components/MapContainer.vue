<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { fetchHeatmapData } from "../api/relitu";
import { useRcdStore } from '@/stores/rcdStore'
const rcdStore = useRcdStore()

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
  console.log('热力图数据:', data); 
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
  heatmapInstance.value.setDataSet({ data, max: 5 });
  heatmapInstance.value.hide(); // 默认隐藏
  console.log('heatmapInstance:', heatmapInstance.value);
}

// ========== 关键改动1：修改 toggleHeatmap，添加标记显示/隐藏控制 ==========
function toggleHeatmap() {
  if (!heatmapInstance.value || typeof heatmapInstance.value.hide !== 'function') {
    console.warn('热力图尚未初始化或方法不存在');
    return;
  }
  heatmapVisible.value = !heatmapVisible.value;
  
  if (heatmapVisible.value) {
    heatmapInstance.value.show();
    hideAllMarkers(); // 打开热力图 → 隐藏所有标记
  } else {
    heatmapInstance.value.hide();
    showAllMarkers(); // 关闭热力图 → 显示所有标记
  }
}

// ========== 关键改动2：新增标记批量显示/隐藏函数 ==========
// 隐藏所有位置标记
function hideAllMarkers() {
  otherMarkers.forEach(marker => {
    if (map && marker && typeof marker.hide === 'function') {
      marker.hide(); // AMap.Marker 自带 hide 方法
    }
  });
}
// 显示所有位置标记
function showAllMarkers() {
  otherMarkers.forEach(marker => {
    if (map && marker && typeof marker.show === 'function') {
      marker.show(); // AMap.Marker 自带 show 方法
    }
  });
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

// ========== 关键改动3：修改 fetchAllLocations，新增热力图状态判断 ==========
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
        const isMe = loc.user_id == myUserId;
        console.log('当前用户ID:', myUserId, '记录用户ID:', loc.user_id, 'isMe:', isMe);
        const marker = new window.AMap.Marker({
          position: [parseFloat(loc.lng), parseFloat(loc.lat)],
          title: loc.content,
          icon: isMe
            ? 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png'
            : 'assets/mark_b.png',
          opacity: 0.7
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

      // 新增：如果当前热力图是显示状态，新标记创建后直接隐藏
      if (heatmapVisible.value) {
        hideAllMarkers();
      }
    })
    .catch(error => {
      console.error('获取位置信息失败:', error);
    });
}

// 定时获取所有用户位置
function startFetchingLocations() {
  const user_id = sessionStorage.getItem('userId');
  
  // 等待地图完全初始化
  const checkMapReady = setInterval(() => {
    if (map) {
      clearInterval(checkMapReady);
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
    plugins: ["AMap.Scale", "AMap.HeatMap"],
  })
    .then(async (AMap) => {
      map = new AMap.Map("container", {
        viewMode: "3D",
        zoom: 16.5,
        center: [120.3440, 30.3146],
      });
      await initHeatmap(AMap); 
      startFetchingLocations(); 
    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  map?.destroy();
  fetchTimer && clearInterval(fetchTimer); // 新增：清除定时器，避免内存泄漏
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
.heatmap-toggle-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}
</style>