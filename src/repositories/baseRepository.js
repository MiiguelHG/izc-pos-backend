export default class BaseRepository {
    constructor(model){
        this.model = model;
    }

    // static getInstance(model){
    //     if(!this.instance){
    //         this.instance = new BaseRepository(model);
    //     }
    //     return this.instance;
    // }

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