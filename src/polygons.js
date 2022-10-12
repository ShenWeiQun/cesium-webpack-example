import * as Cesium from "cesium";
const polygons = [
  {
    name: '地信楼',
    description:
      `<table class="cesium-infoBox-defaultTable"><tbody>` +
      `<tr><th>校区</th><td>东南校区</td></tr>` +
      `<tr><th>院校</th><td>滁州学院</td></tr>` +
      `<tr><th>建造时间</th><td>1988</td></tr>` +
      `<tr><th>建造团队</th><td>第一工程建筑厂</td></tr>` +
      `<tr><th>管理人</th><td>吴老师</td></tr>` +
      `</tbody></table>`,
    coordinates: [118.30103411089297, 32.271824944178775, 118.30192392243858, 32.27184857152993, 118.30189913667601, 32.27159825515893, 118.3010782382438, 32.27161001641528]

  },
  {
    name: '行政楼',
    description:
      `<table class="cesium-infoBox-defaultTable"><tbody>` +
      `<tr><th>校区</th><td>东南校区</td></tr>` +
      `<tr><th>院校</th><td>滁州学院</td></tr>` +
      `<tr><th>建造时间</th><td>1999</td></tr>` +
      `<tr><th>建造团队</th><td>第二工程建筑厂</td></tr>` +
      `<tr><th>管理人</th><td>莘老师</td></tr>` +
      `</tbody></table>`,
    coordinates: [118.30087998621775, 32.272232914608324, 118.30082579723899, 32.27188482261628, 118.30191169187147, 32.27187382891908, 118.30192422913001, 32.27226209709855]

  },
  {
    name: '教学楼',
    description:
      `<table class="cesium-infoBox-defaultTable"><tbody>` +
      `<tr><th>校区</th><td>西北校区</td></tr>` +
      `<tr><th>院校</th><td>滁州学院</td></tr>` +
      `<tr><th>建造时间</th><td>2022</td></tr>` +
      `<tr><th>建造团队</th><td>第三工程建筑厂</td></tr>` +
      `<tr><th>管理人</th><td>程老师</td></tr>` +
      `</tbody></table>`,
    coordinates: [118.30012932939333, 32.271449465432966, 118.30067104477152, 32.27144031326865, 118.30067593034214, 32.27165617131835, 118.3001373713048, 32.2716613216608]

  },
  {
    name: '信息楼',
    description:
      `<table class="cesium-infoBox-defaultTable"><tbody>` +
      `<tr><th>校区</th><td>西南校区</td></tr>` +
      `<tr><th>院校</th><td>滁州学院</td></tr>` +
      `<tr><th>建造时间</th><td>2000</td></tr>` +
      `<tr><th>建造团队</th><td>第五工程建筑厂</td></tr>` +
      `<tr><th>管理人</th><td>林老师</td></tr>` +
      `</tbody></table>`,
    coordinates: [118.30013009297532, 32.27128847849461, 118.30011296310381, 32.271066052651186, 118.3008307982482, 32.271054747799, 118.30083662707955, 32.271281074591315]
  },
]

const addPolygons = (viewer) => {
  polygons.forEach(({ coordinates, name, description }) => {
    viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(coordinates)
        ),
        material: Cesium.Color.RED.withAlpha(0),
        classificationType: Cesium.ClassificationType.BOTH,
        // extrudedHeight: 250000,

      },
      name,
      description
    });
  })
}

const conversionCoordinates = (viewer, position) => {
  const pickPosition = viewer.scene.pickPosition(position);
  const { latitude, longitude } = Cesium.Cartographic.fromCartesian(pickPosition);
  const positionT = [Cesium.Math.toDegrees(longitude), Cesium.Math.toDegrees(latitude)]
  console.log(positionT)
  return positionT
}

export {
  addPolygons,
  conversionCoordinates
}


