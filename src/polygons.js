import * as Cesium from "cesium";
const polygons = [
  {
    name: '地信楼',
    description: "建造于1988",
    coordinates: [118.30103411089297, 32.271824944178775, 118.30192392243858, 32.27184857152993, 118.30189913667601, 32.27159825515893, 118.3010782382438, 32.27161001641528]

  },
  {
    name: '行政楼',
    description: "建造于2011",
    coordinates: [118.30087998621775, 32.272232914608324, 118.30082579723899, 32.27188482261628, 118.30191169187147, 32.27187382891908, 118.30192422913001, 32.27226209709855]

  },
  {
    name: '教学楼',
    description: "建造于1999",
    coordinates: [118.30012932939333, 32.271449465432966, 118.30067104477152, 32.27144031326865, 118.30067593034214, 32.27165617131835, 118.3001373713048, 32.2716613216608]

  },
  {
    name: '信息楼',
    description: "建造于2000",
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


