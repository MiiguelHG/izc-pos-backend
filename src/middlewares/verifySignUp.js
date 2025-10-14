import db from "../models/index.js";

const {usuario: Usuario, rol: Rol} = db;

// Verificar si el nombre o email ya existen //
export class VerifySignUp {
    static async checkDuplicateUsernameOrEmail(req, res, next) {
        try {
            const userByUsername = await Usuario.findOne({
                where: { nombre: req.body.nombre },
            });
            if (userByUsername){
                return res.status(400).json({ message: "Failed! Username is already in use!" });
            }

            const userByEmail = await Usuario.findOne({
                where: { email: req.body.email },
            });
            if (userByEmail){
                return res.status(400).json({ message: "Failed! Email is already in use!" });
            }

            next();
        }catch (error) {
            console.error("Error checking duplicate username or email:", error);
            res.status(500).json({ message: error.message });
        }
    };

// Verificar si el rol ya existe //
    static async checkRolesExists(req, res, next) {
        try{
            const { id_rol } = req.body;

            if(!id_rol){
                return next();
            }

            const existingRole = await Rol.findByPk(id_rol);
            if(!existingRole){
                return res.status(400).json({ message: `El rol con ID ${id_rol} no existe` });
            }

            next();
        }catch(error){
            console.error("Error en checkRoleExists", error);
            res.status(500).json({ message: "Error verificando el rol" });
        }
    };
}