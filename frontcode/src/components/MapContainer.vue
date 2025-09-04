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
  heatmapInstance.value.setDataSet({ data, max: 100 });
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
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom: 16.5, // 初始化地图级别
        center: [120.3440, 30.3146], // 初始化地图中心点位置
      });
      await initHeatmap(AMap); // 初始化热力图
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
