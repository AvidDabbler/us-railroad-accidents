import type { CircleLayer, GeoJSONSourceRaw, Map as MapType } from "mapbox-gl";
import { GeoJsonLayer, loadLayers, Map, useMapbox } from "../components/map";
import "mapbox-gl/dist/mapbox-gl.css";

const testing: {source: {id: string, data: GeoJSONSourceRaw['data']}, layers: [CircleLayer]} = {
  source: {
    id: "accidents",
    data: 'https://raw.githubusercontent.com/AvidDabbler/us-railroad-accidents/main/data/us-railroad-accidents-2012-2022.json',
  },
  layers: [
    {
      id: "accidents",
      type: "circle",
      source: "accidents",
      paint: {
        "circle-radius": 4,
        // "circle-radius": [
        //   'interpolate',
        //   ['linear'],

        // ],
        "circle-stroke-width": 2,
        "circle-color": "red",
        "circle-stroke-color": "white",
      },
    },
  ],
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
        <GeoJsonLayer
          source={testing.source}
          layers={testing.layers}
        ></GeoJsonLayer>
      </Map>
    </div>
  );
}

export default App;
