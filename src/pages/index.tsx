import type { Map as MapType } from "mapbox-gl";
import { GeoJsonLayer, loadLayers, Map, useMapbox } from "../components/map";
import "mapbox-gl/dist/mapbox-gl.css";

const mapInit = (map: MapType) => {
  loadLayers(map, [
    {
      source: {
        id: "accidents",
        data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
      },
      layers: [
        {
          id: "accidents",
          type: "circle",
          source: "accidents",
          paint: {
            "circle-radius": 4,
            "circle-stroke-width": 2,
            "circle-color": "red",
            "circle-stroke-color": "white",
          },
        },
      ],
    },
  ]);
};

function App() {
  return (
    <div className="flex h-screen w-screen">
      <Map
        className="flex h-screen w-screen"
        options={{
          center: [-97.93, 38.88],
          zoom: 3.55,
        }}
      >
        {/* <GeoJsonLayer></GeoJsonLayer> */}
      </Map>
    </div>
  );
}

export default App;
