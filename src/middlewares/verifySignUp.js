import { usuarioRepository, rolRepository } from "../repositories/index.js";
import { sendError } from "../utils/responseFormater.js";

// Verificar si el nombre o email ya existen //
export class verifySignUp{
    static async checkDuplicateUsernameOrEmail(req, res, next){
        const { nombre, email } = req.body;

        try{
            const userByUsername = await usuarioRepository.findByAttribute("nombre", nombre);

            if(userByUsername){
                return sendError(res, 400, "Failed! Username is already in use!");
            }
            const userByEmail = await usuarioRepository.findByAttribute("email", email);
            
            if(userByEmail){
                return sendError(res, 400, "Failed! Email is already in use!");
            }
            next();
        }catch(error){
            return sendError(res, 500, `Error checking for duplicate username or email: ${error.message}`);
        }
    };

    static async checkRolesExists(req, res, next){
        try{
            const { rolId } = req.body;

            const existingRole = await rolRepository.findById(rolId);

            if(!existingRole){
                return sendError(res, 400, `El rol con ID ${rolId} no existe`);
            }

            next();
        }catch(error){
             return sendError(res, 500, `Error verificando el rol: ${error.message}`);
        }
    };
}