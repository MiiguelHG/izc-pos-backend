import db from "#models/index.js";

const { acceso, boletoEmitido } = db;

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export class AccesoRepository {
  static async validarAcceso({boletoEmitidoId}) {
    return db.sequelize.transaction(async (transaction) => {
      const boletoExiste = await boletoEmitido.findOne({
        where: { id: boletoEmitidoId },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!boletoExiste) {
        throw createHttpError(404, `Boleto emitido con ID ${boletoEmitidoId} no encontrado`);
      }

      // const museoBoletoId = Number.parseInt(boletoExiste.museoId, 10);
      // if (museoBoletoId !== museoId) {
      //   throw createHttpError(403, `El boleto emitido con ID ${boletoEmitidoId} no corresponde al museo`);
      // }

      const [accesoValido, created] = await acceso.findOrCreate({
        where: { boletoEmitidoId },
        defaults: { boletoEmitidoId },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (created) {
        return true;
      }

      // Validar si el acceso fue despues de las 4:00 PM un dia despues de la fecha de acceso
      // const fechaAcceso = accesoValido.fechaAcceso;
      // const fechaActual = new Date();
      // const fechaLimite = new Date(fechaAcceso);
      // fechaLimite.setDate(fechaLimite.getDate() + 1);
      // fechaLimite.setHours(16, 0, 0, 0);

      const fechaAccesos = new Date(accesoValido.fechaAcceso);
      const fechaActual = new Date();
      const diaAnterior = new Date(fechaActual);
      diaAnterior.setDate(diaAnterior.getDate() - 1);
      
      // verificar que la fecha de acceso sea igual al dia anterior o a la fecha actual
      if (fechaAccesos < diaAnterior || fechaAccesos > fechaActual) {
        throw createHttpError(400, `El acceso con boleto emitido ID ${boletoEmitidoId} no es válido para esta fecha`);
      }

      // Verificar que la hora de acceso haya sido despues de las 4:00 PM
      const horaAcceso = fechaAccesos.getHours();
      if (horaAcceso < 16) {
        throw createHttpError(400, `El acceso con boleto emitido ID ${boletoEmitidoId} no es válido para esta hora`);
      }

      if (fechaActual > fechaLimite) {
        throw createHttpError(400, `El acceso con boleto emitido ID ${boletoEmitidoId} ha expirado`);
      }

      return true;
    });
  }

}