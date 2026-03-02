import BaseRepository from './baseRepository.js';
import db from '../models/index.js';

const { invitado, museo, usuario } = db;

class InvitadoRepository extends BaseRepository {
  constructor() {
    super(invitado);
  }

  async findAllAndCount({ limit, offset, museoId }) {
    const whereClause = {};
    if (museoId) {
      whereClause.museoId = museoId;
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