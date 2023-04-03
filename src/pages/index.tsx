import { useEffect } from "react";
import type { CircleLayer, GeoJSONSourceRaw, HeatmapLayer } from "mapbox-gl";
import type { FeatureCollection, Point, GeoJsonProperties } from "geojson";
import { GeoJsonLayer, Map } from "../components/map";
import "mapbox-gl/dist/mapbox-gl.css";
import CountyData from "../../data/agg-us-railroad-accidents-2012-2022.json" assert { type: "json" }; //

const accidents: {
  source: { id: string; data: GeoJSONSourceRaw["data"] };
  layers: [HeatmapLayer];
} = {
  source: {
    id: "accidents",
    data: "https://raw.githubusercontent.com/AvidDabbler/us-railroad-accidents/main/data/us-railroad-accidents-2012-2022.json",
  },
  layers: [
    {
      id: "accidents",
      type: "heatmap",
      source: "accidents",
      filter: ["all", ["==", "YEAR", 20], ["==", "MONTH", 1]],
      paint: {
        "heatmap-weight": ["case", ["has", "TOTKLD"], 3, 0],
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 13],
        "heatmap-color": [
          "interpolate",
          ["exponential", 1],
          ["heatmap-density"],
          0,
          "hsla(0, 0%, 0%, 0)",
          0.33,
          "hsl(63, 95%, 54%)",
          0.67,
          "hsl(5, 56%, 61%)",
          1,
          "hsl(279, 100%, 31%)",
        ],
        // Adjust the heatmap radius by zoom level
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 5, 30, 50],
        // Transition from heatmap to circle layer by zoom level
        "heatmap-opacity": 0.7,
      },
    },
  ],
};

const counties: {
  source: { id: string; data: GeoJSONSourceRaw["data"] };
  layers: [CircleLayer];
} = {
  source: {
    id: "counties",
    data: CountyData as FeatureCollection<Point, GeoJsonProperties>, // "https://github.com/zeke/us-counties/raw/master/county.geo.json",
  },
  layers: [
    {
      id: "counties",
      source: "counties",
      type: "circle",
      paint: {
        "circle-radius": 6,
        "circle-color": "#B42222",
      },
    },
  ],
};

const App = () => {
  useEffect(() => {
    console.log(CountyData);
  }, []);
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
          source={accidents.source}
          layers={accidents.layers}
        ></GeoJsonLayer>
        <GeoJsonLayer
          source={counties.source}
          layers={counties.layers}
        ></GeoJsonLayer>
      </Map>
    </div>
  );
};

export default App;
