import { DipomexRepository } from "#repositories/index.js";
import { readFile } from "node:fs/promises";
import db from "#models/index.js";

const { pais, estado, municipio, codigoPostal, sequelize } = db;

const readLocalJson = async (relativePath) => {
  const fileUrl = new URL(relativePath, import.meta.url);
  const fileContent = await readFile(fileUrl, "utf-8");
  return JSON.parse(fileContent);
};

export const dipomexSeeder = async () => {
  try {
    const [existEstados, existMunicipios, existCodigosPostales, existPaises] = await Promise.all([
      estado.count(),
      municipio.count(),
      codigoPostal.count(),
      pais.count()
    ]);

    if (existEstados > 0 || existMunicipios > 0 || existCodigosPostales > 0 || existPaises > 0) {
      console.log('Dipomex data already exists. Skipping seeding.');
      return;
    }
    
    const [estados, municipios, codigosPostales, paises] = await Promise.all([
      readLocalJson("./data/estados.json"),
      readLocalJson("./data/municipios.json"),
      readLocalJson("./data/cp.json"),
      readLocalJson("./data/countries.json")
    ]);
    const created = await DipomexRepository.createAll(estados, municipios, codigosPostales, paises);

    if (!created) {
      console.error('Error occurred while seeding Dipomex data: No records were created.');
    }
  } catch (error) {
    console.error('Error occurred while seeding Dipomex data:', error);
  }
}