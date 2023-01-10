import * as Cesium from "cesium";

const tilesetUrls = [
  "https://api.klcgis.com/3dtiles/campus-1/tileset.json", // 会峰校区1
  // "https://api.klcgis.com/3dtiles/campus-2/tileset.json", // 会峰校区2
  // "https://api.klcgis.com/3dtiles/campus-3/tileset.json", // 会峰校区3
  // "https://api.klcgis.com/3dtiles/campus-4/tileset.json"  // 琅琊校园
]
const addTileset = (viewer) => {
  const tilesets = [];

  tilesetUrls.forEach((item) => {
    const tileset = new Cesium.Cesium3DTileset({
      url: item,
      // maximumScreenSpaceError: 2, // 数值加大，能让最终成像变模糊
      // maximumMemoryUsage: 10240, // 切片缓存
      debugShowContentBoundingVolume: true, // 显示debugger轮廓
    });
    viewer.scene.primitives.add(tileset);
    tilesets.push(tileset)
  })
  viewer.flyTo(tilesets[0]);
}

export {
  addTileset
}