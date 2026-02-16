import BaseRepository from './baseRepository.js';
import db from '../models/index.js';
import { Op } from 'sequelize';

const { invitado, museo, usuario } = db;

class InvitadoRepository extends BaseRepository {
  constructor() {
    super(invitado);
  }

  async findAllAndCount({ limit, offset }) {
    return this.model.findAndCountAll({
      limit,
      offset,
      include: [
        { model: museo, as: 'museo' },
        { model: usuario, as: 'usuario', attributes: { exclude: ['password'] } }
      ],
      order: [['id', 'DESC']]
    });
  }
}

export const invitadoRepository = new InvitadoRepository();