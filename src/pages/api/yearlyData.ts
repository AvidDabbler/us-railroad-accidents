import path from "path";
import { promises as fs } from "fs";
import type { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), "data");
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + "/2022.geojson", "utf8");
  //Return the content of the data file in json format
  // @ts-ignore
  res.status(200).json(fileContents); 
}
