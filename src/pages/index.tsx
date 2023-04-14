import { useEffect, useState } from "react";
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
      // filter: ["all", ["==", "YEAR", 20]],
      paint: {
        "heatmap-weight": {
          property: "TOTKLD",
          type: "exponential",
          stops: [
            [1, 0],
            [20, 1],
          ],
        },
        "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 13],
        "heatmap-color": [
          "interpolate",
          ["exponential", 1],
          ["heatmap-density"],
          0,
          "hsla(0, 0%, 0%, 0)",
          0.25,
          "hsl(63, 95%, 54%)",
          0.5,
          "hsl(5, 56%, 61%)",
          0.75,
          "hsl(333, 45%, 50%)",
          1,
          "hsl(279, 100%, 31%)",
        ],
        // Adjust the heatmap radius by zoom level
        "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 20, 50, 50],
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
  const [files, setFiles] = useState<any[]>([]);

  const handleChange = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files?.[0], "UTF-8");
    fileReader.onload = e => {
      console.log("e.target.result", e.target?.result);
      setFiles([...files, e.target.result]);
    };
  };

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
        <div>
          <input
            type="file"
            onChange={(e) => handleChange(e)}
          />
          <div>{JSON.stringify(files)}</div>
        </div>
        {/* <GeoJsonLayer
          source={counties.source}
          layers={counties.layers}
        ></GeoJsonLayer> */}
        {/* <GeoJsonLayer
          source={accidents.source}
          layers={accidents.layers}
        ></GeoJsonLayer> */}
      </Map>
    </div>
  );
};

export default App;
