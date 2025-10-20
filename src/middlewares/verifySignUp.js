import db from "../models/index.js";
import { sendSuccess, sendError } from "../utils/responseFormater.js";

const {usuario: Usuario, rol: Rol} = db;

// Verificar si el nombre o email ya existen //
export default class verifySignUp{
    static async checkDuplicateUsernameOrEmail(req, res, next){
        try{
            const userByUsername = await Usuario.findOne({
                where: { nombre: req.body.nombre },
            });
            if(userByUsername){
                sendError(res, 400, "Failed! Username is already in use!");
            }
            const userByEmail = await Usuario.findOne({
                where: { email: req.body.email },
            });
            if(userByEmail){
                sendError(res, 400, "Failed! Email is already in use!");
            }
            next();
        }catch(error){
            console.error("Error checking duplicate username or email:", error);
            sendError(res, 500, error.message);
        }
    };

    static async checkRolesExists(req, res, next){
        try{
            const { id_rol } = req.body;

            if(!id_rol){
                return next();
            }

            const existingRole = await Rol.findByPk(id_rol);
            if(!existingRole){
                sendError(res, 400, `El rol con ID ${id_rol} no existe`);
                // return res.status(400).json({ message: `El rol con ID ${id_rol} no existe` });
            }
            next();
        }catch(error){
            console.error("Error en checkRoleExists", error);
            sendError(res, 500, "Error verificando el rol");
        }
    };
}