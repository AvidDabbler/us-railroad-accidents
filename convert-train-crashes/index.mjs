import csvtojson from "csvtojson";
import path from "path";
import fs from "fs";

import File2022 from "../data/org/2022.json" assert { type: "json" };
import File2021 from "../data/org/2021.json" assert { type: "json" };
import File2020 from "../data/org/2020.json" assert { type: "json" };
import File2019 from "../data/org/2019.json" assert { type: "json" };
import File2018 from "../data/org/2018.json" assert { type: "json" };
import File2017 from "../data/org/2017.json" assert { type: "json" };
import File2016 from "../data/org/2016.json" assert { type: "json" };
import File2015 from "../data/org/2015.json" assert { type: "json" };
import File2014 from "../data/org/2014.json" assert { type: "json" };
import File2013 from "../data/org/2013.json" assert { type: "json" };
import File2012 from "../data/org/2012.json" assert { type: "json" };

export const loadJson = async (causes, effects) => {
  const updatedData = { type: "FeatureCollection", features: [] };
  for (const [year, data] of Object.entries(yearlyData)) {
    console.log(`Processing ${year}`);
    for (const feature of data.features) {
      const CAUSE = feature.properties.CAUSE
        ? feature.properties.CAUSE
        : "UNKNOWN";
      const { YEAR, MONTH, DAY, STATE, RAILROAD, TOTINJ, TOTKLD } =
        feature.properties;
      const causeInfo = causes.find((cause) => cause.Code === CAUSE) ?? {
        Code: "UNKNOWN",
        Description: "Unknown",
        Category: "Unknown",
        Title: "Unknown",
      };
      updatedData.features.push({
        ...feature,
        properties: {
          YEAR,
          MONTH,
          DAY,
          CAUSE,
          STATE,
          RAILROAD,
          TOTINJ,
          TOTKLD,
          ...causeInfo,
        },
      });
    }
  }
  fs.writeFileSync(
    path.join(process.cwd(), "data/us-railroad-accidents-2012-2022.json"),
    JSON.stringify(updatedData)
  );
};

const yearlyData = {
  2022: File2022,
  2021: File2021,
  2020: File2020,
  2019: File2019,
  2018: File2018,
  2017: File2017,
  2016: File2016,
  2015: File2015,
  2014: File2014,
  2013: File2013,
  2012: File2012,
};

const convertCsv = async (fileLocation) => {
  return await csvtojson()
    .fromFile(fileLocation)
    .then((csvRow) => {
      return csvRow;
    });
};

const main = async () => {
  const causes = await convertCsv("data/org/causes.csv");
  const effects = await convertCsv("data/org/effects.csv");

  await loadJson(causes, effects);
};

main();
