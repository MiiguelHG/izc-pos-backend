import { DipomexRepository } from "#repositories/index.js";
import { readFile } from "node:fs/promises";

const readLocalJson = async (relativePath) => {
  const fileUrl = new URL(relativePath, import.meta.url);
  const fileContent = await readFile(fileUrl, "utf-8");
  return JSON.parse(fileContent);
};

export const dipomexSeeder = async () => {
  try {
    const existingCPs = await DipomexRepository.findAllCP();
    if (existingCPs.length > 0) {
      console.log('Dipomex data already exists, skipping seeding.');
      return;
    }
    
    const [estados, municipios, codigosPostales] = await Promise.all([
      readLocalJson("./data/estados.json"),
      readLocalJson("./data/municipios.json"),
      readLocalJson("./data/cp.json"),
    ]);
    const created = await DipomexRepository.createAll(estados, municipios, codigosPostales);

    if (!created) {
      console.error('Error occurred while seeding Dipomex data: No records were created.');
    }
  } catch (error) {
    console.error('Error occurred while seeding Dipomex data:', error);
  }
}