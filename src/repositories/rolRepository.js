export default class BaseRepository {
    constructor(model){
        this.model = model;
    }

    async findAll(options = {}){
        return await this.model.findAll(options);
    }

    async findById(id, options = {}){
        return await this.model.findByPk(id, options);
    }

    async create(data){
        return await this.model.create(data);
    }

    async update(options = {}, data = {}){
        const instance = await this.model.update(data, { where: options });
        return instance[0] > 0;
    }

    async delete(options = {}){
        const instance = await this.model.destroy({ where: options });
        return instance > 0;
    }
}
