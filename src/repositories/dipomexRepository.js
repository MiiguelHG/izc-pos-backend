export class DipomexRepository {
  static URL = 'https://api.tau.com.mx/dipomex/v1';

  static async getEstados() {
    try {
      const res = await fetch(`${DipomexRepository.URL}/estados`,{
        method: 'GET',
        headers: {
          'APIKEY': process.env.DIPOMEX_API_KEY
        }
      });

      if (!res.ok) {
        throw new Error(`Error fetching estados: ${res.status}`);
      }

      const resJson = await res.json();
      return resJson.estados;

      // return resJson.estados;


    } catch (error) {
      throw new Error(`Error al consultar código postal: ${error}`);
    }
  }

  static async getByCodigoPostal(codigoPostal) {
    try {
      const res = await fetch(`${DipomexRepository.URL}/codigo_postal?cp=${codigoPostal}`,{
        method: 'GET',
        headers: {
          'APIKEY': process.env.DIPOMEX_API_KEY
        }
      });

      if (!res.ok) {
        throw new Error(`Error fetching código postal: ${res.status}`);
      }

      const resJson = await res.json();
      return resJson.codigo_postal;
    } catch (error) {
      throw new Error(`Error al consultar código postal: ${error}`);
    }
  }
}