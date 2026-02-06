import BaseRepository from './baseRepository.js';
import db from '../models/index.js';
import { Op } from 'sequelize';

const { invitado } = db;

class InvitadoRepository extends BaseRepository {
  constructor() {
    super(invitado);
  }

  async findInvitadosSinIngreso() {
    return await this.model.findAll({
      where: {
        usado: false,
        fechaExpiracion: {
          [Op.gt]: new Date() // Solo invitados no expirados
        }
      }
    })
  }
}

export const invitadoRepository = new InvitadoRepository();