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

    async update(id, data){
        const instance = await this.findByPk(id);
        if(!instance) {
            return false;
        }

        return instance[0] > 0;
    }

    async delete(id){
        const instance = await this.findByPk(id);
        if(!instance) throw new Error("Instance not found");
        return await instance.destroy();
    }
}