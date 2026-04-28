import BaseRepository from './baseRepository.js';
import db from '../models/index.js';
import { Op } from 'sequelize';

const { invitado, museo, usuario } = db;

class InvitadoRepository extends BaseRepository {
  constructor() {
    super(invitado);
  }

  async findAllAndCount({ limit, offset, museoId , search = ''}) {
    const whereClause = {};
    if (museoId) {
      whereClause.museoId = museoId;
    }
    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { id: { [Op.like]: `%${search}%` } }
      ];
    }

    return this.model.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        { model: museo, as: 'museo' },
        { model: usuario, as: 'usuario', attributes: ['id', 'nombre'] }
      ],
      order: [['id', 'DESC']]
    });
  }
}

export const invitadoRepository = new InvitadoRepository();