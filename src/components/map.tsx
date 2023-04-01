import {
  RefObject,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import mapboxgl, {
  CircleLayer,
  FillLayer,
  LineLayer,
  SymbolLayer,
} from "mapbox-gl";
import type { LngLatLike, Map as MapType } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

export function useMapbox({
  center,
  zoom = 17,
  onInit,
}: {
  center: LngLatLike;
  zoom?: number;
  onInit: (map: MapType) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapType>();
  const [loaded, setLoaded] = useState<boolean>();
  useEffect(() => {
    console.log("here");
    if (ref.current && !map && !loaded) {
      const map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center,
        zoom,
      });
      setLoaded(true);
      setMap(map);
      map.on("load", () => onInit(map));
    }
  }, [ref, center, zoom, map]);
  return { ref, map };
}

const MapContext = createContext<MapType | null>(null);
const StyleContext = createContext<string | null | undefined>(null);

export const Map = ({
  options,
  children,
  className,
}: {
  children?: React.ReactNode;
  options: Partial<mapboxgl.MapboxOptions>;
  className: string;
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [style, setStyle] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!mapContainer.current || map) return; // initialize map only once
    try {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
      const _map = new mapboxgl.Map({
        container: mapContainer.current,
        fitBoundsOptions: { padding: 100, maxZoom: 18 },
        style: "mapbox://styles/mapbox/streets-v12", // style URL
        ...options,
      });

      const onLoad = () => {
        setMap(_map);
        setStyle(_map.getStyle().name);
      };

      _map.on("load", onLoad);
      return () => {
        _map.off("load", onLoad);
      };
    } catch (e) {
      console.error(e);
    }
  }, [mapContainer, setMap, options, map]);

  useEffect(() => {
    if (!map) return;
    const onStyleChange = () => {
      setStyle(map.getStyle().name);
    };
    const onError = (e: any, ...rest: any) => {
      console.log("A error event occurred.", e, rest);
    };
    map.on("style.load", onStyleChange);
    map.on("error", onError);
    return () => {
      map.off("style.load", onStyleChange);
      map.off("error", onError);
    };
  }, [map]);

  return (
    <div id="map-fullscreen-container" className={className}>
      <MapContext.Provider value={map}>
        <StyleContext.Provider value={style}>
          <div className={className} ref={mapContainer} />
          {map && style && children}
        </StyleContext.Provider>
      </MapContext.Provider>
    </div>
  );
};

export const useMap = () => {
  const map = useContext(MapContext);
  if (!map) {
    throw new Error("useMap should be used in <Map> child components");
  }
  return map;
};

export const loadGeojson = ({
  map,
  layers,
  source,
}: {
  map: MapType;
  layers: (CircleLayer | FillLayer | LineLayer | SymbolLayer)[];
  source: {
    data: FeatureCollection<Geometry, GeoJsonProperties> | string;
    id: string;
  };
}) => {
  if (!map.getSource(source.id)) {
    map.addSource(source.id, {
      type: "geojson",
      // Use a URL for the value for the `data` property.
      data: source.data,
    });
  }
  layers.forEach((layer) => map.addLayer(layer));
  return () => {
    map.removeSource(source.id);
  };
};

export const loadLayers = (
  map: MapType,
  layerConfigs: {
    layers: (CircleLayer | FillLayer | LineLayer | SymbolLayer)[];
    source: {
      data: FeatureCollection<Geometry, GeoJsonProperties> | string;
      id: string;
    };
  }[]
) => {
  layerConfigs.forEach(({ layers, source }) =>
    loadGeojson({ map, layers, source })
  );
};

export const GeoJsonLayer = ({
  layers,
  source,
}: {
  layers: (CircleLayer | FillLayer | LineLayer | SymbolLayer)[];
  source: {
    data: FeatureCollection<Geometry, GeoJsonProperties> | string;
    id: string;
  };
}) => {
  const map = useMap();
  useEffect(() => {
    loadGeojson({ map, layers, source });
  }, []);
  return null;
};
