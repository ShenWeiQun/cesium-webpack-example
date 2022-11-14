import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "../src/css/main.css"

const viewer = new Cesium.Viewer('cesiumContainer', {
  // globe: false,
  // skyBox: false
  // terrainProvider: Cesium.createWorldTerrain()
});
const { scene, globe, camera } = viewer

viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
scene.debugShowFramesPerSecond = true; // 显示帧率
// globe.depthTestAgainstTerrain = true; // 开启器深度测试地球球面

const tileset = viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
  url: "https://api.klcgis.com/3dtiles/campus-1/tileset.json",
}));


var points = [
  { x: -2559491.0763998125, y: 4752931.179745129, z: 3385673.000708567 },
  { x: -2559559.670575901, y: 4752688.014257276, z: 3385934.148835126 },
  { x: -2559782.783347892, y: 4752627.507305205, z: 3385835.6220768834 },
  {x: -2559762.0522570354, y: 4752785.123409692, z: 3385633.425214789},
];
var wyoming = viewer.entities.add({
  polygon : {
    hierarchy : points,
    // height : 0,
    material : Cesium.Color.RED.withAlpha(0.5),
    outline : true,
    outlineColor : Cesium.Color.BLACK
  }
});
//由于shader只能传固定长度，所以这里的长度要写成定好的，并且不能长度不能为0;
//二三维一样的，改下类型就行了，一般只用判断是否在平面内
var shader = `bool pointInPolygon(vec3 p, vec3 points[3]){
  bool inside = false;
  
  return inside;
}`

tileset.tileLoad.addEventListener(function (tile) {
  const model = tile.content._model
  if (model) {
    const customShader = new Cesium.CustomShader({
      uniforms: {
        u_colorIndex: {
          type: Cesium.UniformType.FLOAT,
          value: 0.0
        },
        'u_points1': {
          type: Cesium.UniformType.VEC3,
          value: points[0]
        },
        'u_points2': {
          type: Cesium.UniformType.VEC3,
          value: points[1]
        },
        'u_points3': {
          type: Cesium.UniformType.VEC3,
          value: points[2]
        },
        'u_points4': {
          type: Cesium.UniformType.VEC3,
          value: points[3]
        }
      },
      vertexShaderText: `
      bool pointInPolygon(vec3 p, vec3 points[4]){
        bool inside = false;
        const int length = 4;
        for (int i = 0; i < length; i++) {
          float xi = points[i].x;
          float yi = points[i].y;
          float xj;
          float yj;
          if (i == 0) {
            xj = points[length - 1].x;
            yj = points[length - 1].y;
          } else {
            xj = points[i - 1].x;
            yj = points[i - 1].y; 
          }
          bool intersect = ((yi > p.y) != (yj > p.y)) && (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi);
          if (intersect) {
            inside = !inside;
          }
        }
        return inside;
      }

      void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
        vec3 asdasd =  (czm_model * vec4(vsInput.attributes.positionMC, 1.0)).xyz;
        vec3 vec3Array[4];
        vec3Array[0] = u_points1;
        vec3Array[1] = u_points2;
        vec3Array[2] = u_points3;
        vec3Array[3] = u_points4;
  bool isInside=pointInPolygon(asdasd,vec3Array);
  if(isInside){
    vsOutput.positionMC.y = u_colorIndex;
  }
       
      }
      `
    });
    const asdasdasdasda = model._sceneGraph._components.transform[14]

    tile.content.update = function (tileset, frameState) {
      const model = this._model;
      const tile = this._tile;

      model.colorBlendAmount = tileset.colorBlendAmount;
      model.colorBlendMode = tileset.colorBlendMode;
      model.modelMatrix = tile.computedTransform;
      // model.customShader = tileset.customShader;
      model.featureIdLabel = tileset.featureIdLabel;
      model.instanceFeatureIdLabel = tileset.instanceFeatureIdLabel;
      model.lightColor = tileset.lightColor;
      model.imageBasedLighting = tileset.imageBasedLighting;
      model.backFaceCulling = tileset.backFaceCulling;
      model.shadows = tileset.shadows;
      model.showCreditsOnScreen = tileset.showCreditsOnScreen;
      model.splitDirection = tileset.splitDirection;
      model.debugWireframe = tileset.debugWireframe;
      model.showOutline = tileset.showOutline;
      model.outlineColor = tileset.outlineColor;
      model.pointCloudShading = tileset.pointCloudShading;

      // Updating clipping planes requires more effort because of ownership checks
      const tilesetClippingPlanes = tileset.clippingPlanes;
      model.referenceMatrix = tileset.clippingPlanesOriginMatrix;
      if (Cesium.defined(tilesetClippingPlanes) && tile.clippingPlanesDirty) {
        // Dereference the clipping planes from the model if they are irrelevant.
        model._clippingPlanes =
          tilesetClippingPlanes.enabled && tile._isClipped
            ? tilesetClippingPlanes
            : undefined;
      }

      // If the model references a different ClippingPlaneCollection from the tileset,
      // update the model to use the new ClippingPlaneCollection.
      if (
        Cesium.defined(tilesetClippingPlanes) &&
        Cesium.defined(model._clippingPlanes) &&
        model._clippingPlanes !== tilesetClippingPlanes
      ) {
        model._clippingPlanes = tilesetClippingPlanes;
        model._clippingPlanesState = 0;
      }

      model.update(frameState);
    };
    customShader.setUniform("u_colorIndex", -asdasdasdasda)
    model.customShader = customShader
    // console.log(model._sceneGraph);
    // debugger

  }
});
viewer.flyTo(tileset);



