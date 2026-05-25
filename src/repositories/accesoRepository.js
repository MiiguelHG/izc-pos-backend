import db from "#models/index.js";
import { DateTime } from "luxon";

const { acceso, boletoEmitido } = db;
const ZONA_MX = "America/Mexico_City";
const HORA_REINGRESO = 16;

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const obtenerFechaActualMx = () => DateTime.now().setZone(ZONA_MX);

const obtenerFechaAccesoMx = (fechaAcceso) => DateTime.fromJSDate(fechaAcceso, { zone: ZONA_MX });

export class AccesoRepository {
  static async validarAcceso({ boletoEmitidoId }) {
    return db.sequelize.transaction(async (transaction) => {
      const fechaActualMx = obtenerFechaActualMx();
      const esReingresoPermitido = fechaActualMx.hour >= HORA_REINGRESO;
      const ayerMx = fechaActualMx.minus({ days: 1 }).startOf("day");

      const boletoExiste = await boletoEmitido.findOne({
        where: { id: boletoEmitidoId },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!boletoExiste) {
        throw createHttpError(404, `Boleto emitido con ID ${boletoEmitidoId} no encontrado`);
      }

      const [accesoValido, created] = await acceso.findOrCreate({
        where: { boletoEmitidoId },
        defaults: {
          boletoEmitidoId,
          reingreso: esReingresoPermitido
        },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (created) {
        return true;
      }

      if (!accesoValido.reingreso) {
        throw createHttpError(403, `El acceso con boleto emitido ID ${boletoEmitidoId} ya fue consumido.`);
      }

      const fechaAccesoMx = obtenerFechaAccesoMx(accesoValido.fechaAcceso).startOf("day");
      const fueCreadoAyer = fechaAccesoMx.hasSame(ayerMx, "day");

      await accesoValido.update(
        { reingreso: false },
        { transaction }
      );

      if (!fueCreadoAyer) {
        throw createHttpError(403, `El acceso con boleto emitido ID ${boletoEmitidoId} ya no es válido para reingreso.`);
      }

      return true;
    });
  }

}