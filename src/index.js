import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "../src/css/main.css"
import { addPolygons } from "./polygons"
import { addTileset } from "./tilesets"

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token
// Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxk';

// A simple demo of 3D Tiles feature picking with hover and select behavior
// Building data courtesy of NYC OpenData portal: http://www1.nyc.gov/site/doitt/initiatives/3d-building.page
const viewer = new Cesium.Viewer("cesiumContainer", {
  geocoder: false, // 搜索按钮
  homeButton: false, // 主页按钮
  sceneModePicker: false, // 地图模式按钮
  baseLayerPicker: false, // 底图选择按钮
  navigationHelpButton: false, // 帮助按钮

  animation: false, // 动画控制组件
  timeline: false, // 时间线组件
  fullscreenButton: false, // 全屏按钮

  skyBox: false,//天空盒子
  // skyAtmosphere: false, // 大气光晕
  creditContainer: document.createElement('div'), // 版权信息




  // terrainProvider: Cesium.createWorldTerrain(),
  globe: false // 不加载地球
});

// viewer.scene.globe.depthTestAgainstTerrain = true;

// Set the initial camera view to look at Manhattan
const initialPosition = Cesium.Cartesian3.fromDegrees(
  -74.01881302800248,
  40.69114333714821,
  753
);
const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
  21.27879878293835,
  -21.34390550872461,
  0.0716951918898415
);
viewer.scene.camera.setView({
  destination: initialPosition,
  orientation: initialOrientation,
  endTransform: Cesium.Matrix4.IDENTITY,
});

addPolygons(viewer)
addTileset(viewer)

// HTML overlay for showing feature name on mouseover
const nameOverlay = document.createElement("div");
viewer.container.appendChild(nameOverlay);
nameOverlay.className = "backdrop";
nameOverlay.style.display = "none";
nameOverlay.style.position = "absolute";
nameOverlay.style.bottom = "0";
nameOverlay.style.left = "0";
nameOverlay.style["pointer-events"] = "none";
nameOverlay.style.padding = "4px";
nameOverlay.style.backgroundColor = "white";

// Information about the currently selected feature
const selected = {
  feature: undefined,
  originalColor: new Cesium.Color(),
};

// An entity object which will hold info about the currently selected feature for infobox display
const selectedEntity = new Cesium.Entity();

// Get default left click handler for when a feature is not picked on left click
const clickHandler = viewer.screenSpaceEventHandler.getInputAction(
  Cesium.ScreenSpaceEventType.LEFT_CLICK
);

// If silhouettes are supported, silhouette features in blue on mouse over and silhouette green on mouse click.
// If silhouettes are not supported, change the feature color to yellow on mouse over and green on mouse click.
if (
  Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)
) {
  // Silhouettes are supported
  const silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
  silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
  silhouetteBlue.uniforms.length = 0.01;
  silhouetteBlue.selected = [];

  const silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
  silhouetteGreen.uniforms.color = Cesium.Color.LIME;
  silhouetteGreen.uniforms.length = 0.01;
  silhouetteGreen.selected = [];

  viewer.scene.postProcessStages.add(
    Cesium.PostProcessStageLibrary.createSilhouetteStage([
      silhouetteBlue,
      silhouetteGreen,
    ])
  );

  // Silhouette a feature blue on hover.
  viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
    movement
  ) {
    // If a feature was previously highlighted, undo the highlight
    silhouetteBlue.selected = [];

    // Pick a new feature
    const { id } = viewer.scene.pick(movement.endPosition) || {};
    const pickedFeature = id
    if (!Cesium.defined(pickedFeature)) {
      nameOverlay.style.display = "none";
      return;
    }

    // A feature was picked, so show it's overlay content
    nameOverlay.style.display = "block";
    nameOverlay.style.bottom = `${viewer.canvas.clientHeight - movement.endPosition.y
      }px`;
    nameOverlay.style.left = `${movement.endPosition.x}px`;

    const name = pickedFeature.name;
    nameOverlay.textContent = name;

    // Highlight the feature if it's not already selected.
    if (pickedFeature !== selected.feature) {
      silhouetteBlue.selected = [pickedFeature];
    }
  },
    Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // Silhouette a feature on selection and show metadata in the InfoBox.
  viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
    movement
  ) {
    // If a feature was previously selected, undo the highlight
    silhouetteGreen.selected.forEach((item) => {
      item.polygon.material = Cesium.Color.RED.withAlpha(0)
    })
    silhouetteGreen.selected = [];

    // Pick a new feature
    const { id } = viewer.scene.pick(movement.position) || {};
    const pickedFeature = id

    if (!Cesium.defined(pickedFeature)) {
      clickHandler(movement);
      return;
    }

    // Select the feature if it's not already selected
    if (silhouetteGreen.selected[0] === pickedFeature) {
      return;
    }

    // Save the selected feature's original color
    const highlightedFeature = silhouetteBlue.selected[0];
    if (pickedFeature === highlightedFeature) {
      silhouetteBlue.selected = [];
    }

    // Highlight newly selected feature
    silhouetteGreen.selected = [pickedFeature];
    pickedFeature.polygon.material = Cesium.Color.RED.withAlpha(0.5)

    // Set feature infobox description
    const featureName = pickedFeature.name;
    selectedEntity.name = featureName;
    selectedEntity.description =
      'Loading <div class="cesium-infoBox-loading"></div>';
    viewer.selectedEntity = selectedEntity;
    selectedEntity.description = pickedFeature.description
  },
    Cesium.ScreenSpaceEventType.LEFT_CLICK);
} else {
  // Silhouettes are not supported. Instead, change the feature color.

  // Information about the currently highlighted feature
  const highlighted = {
    feature: undefined,
    originalColor: new Cesium.Color(),
  };

  // Color a feature yellow on hover.
  viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
    movement
  ) {
    // If a feature was previously highlighted, undo the highlight
    if (Cesium.defined(highlighted.feature)) {
      highlighted.feature.color = highlighted.originalColor;
      highlighted.feature = undefined;
    }
    // Pick a new feature
    const pickedFeature = viewer.scene.pick(movement.endPosition);
    if (!Cesium.defined(pickedFeature)) {
      nameOverlay.style.display = "none";
      return;
    }
    // A feature was picked, so show it's overlay content
    nameOverlay.style.display = "block";
    nameOverlay.style.bottom = `${viewer.canvas.clientHeight - movement.endPosition.y
      }px`;
    nameOverlay.style.left = `${movement.endPosition.x}px`;
    let name = pickedFeature.getProperty("name");
    if (!Cesium.defined(name)) {
      name = pickedFeature.getProperty("id");
    }
    nameOverlay.textContent = name;
    // Highlight the feature if it's not already selected.
    if (pickedFeature !== selected.feature) {
      highlighted.feature = pickedFeature;
      Cesium.Color.clone(
        pickedFeature.color,
        highlighted.originalColor
      );
      pickedFeature.color = Cesium.Color.YELLOW;
    }
  },
    Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // Color a feature on selection and show metadata in the InfoBox.
  viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
    movement
  ) {
    // If a feature was previously selected, undo the highlight
    if (Cesium.defined(selected.feature)) {
      selected.feature.color = selected.originalColor;
      selected.feature = undefined;
    }
    // Pick a new feature
    const pickedFeature = viewer.scene.pick(movement.position);
    if (!Cesium.defined(pickedFeature)) {
      clickHandler(movement);
      return;
    }
    // Select the feature if it's not already selected
    if (selected.feature === pickedFeature) {
      return;
    }
    selected.feature = pickedFeature;
    // Save the selected feature's original color
    if (pickedFeature === highlighted.feature) {
      Cesium.Color.clone(
        highlighted.originalColor,
        selected.originalColor
      );
      highlighted.feature = undefined;
    } else {
      Cesium.Color.clone(pickedFeature.color, selected.originalColor);
    }
    // Highlight newly selected feature
    pickedFeature.color = Cesium.Color.LIME;
    // Set feature infobox description
    const featureName = pickedFeature.getProperty("name");
    selectedEntity.name = featureName;
    selectedEntity.description =
      'Loading <div class="cesium-infoBox-loading"></div>';
    viewer.selectedEntity = selectedEntity;
    selectedEntity.description =
      `${'<table class="cesium-infoBox-defaultTable"><tbody>' +
      "<tr><th>BIN</th><td>"
      }${pickedFeature.getProperty("BIN")}</td></tr>` +
      `<tr><th>DOITT ID</th><td>${pickedFeature.getProperty(
        "DOITT_ID"
      )}</td></tr>` +
      `<tr><th>SOURCE ID</th><td>${pickedFeature.getProperty(
        "SOURCE_ID"
      )}</td></tr>` +
      `<tr><th>Longitude</th><td>${pickedFeature.getProperty(
        "longitude"
      )}</td></tr>` +
      `<tr><th>Latitude</th><td>${pickedFeature.getProperty(
        "latitude"
      )}</td></tr>` +
      `<tr><th>Height</th><td>${pickedFeature.getProperty(
        "height"
      )}</td></tr>` +
      `<tr><th>Terrain Height (Ellipsoid)</th><td>${pickedFeature.getProperty(
        "TerrainHeight"
      )}</td></tr>` +
      `</tbody></table>`;
  },
    Cesium.ScreenSpaceEventType.LEFT_CLICK);
}


const { frame } = viewer.infoBox;
frame.sandbox.add('allow-scripts');
const { src } = frame;
frame.src = src;

