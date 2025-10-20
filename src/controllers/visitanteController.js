
import visitanteRepository from "../repositories/visitanteRepository.js";
import { sendSuccess } from "../utils/responseFormater.js";
//import VisitanteRepository from "../repositories/visitanteRepository.js";


//const visitanteRepository = new VisitanteRepository();

export class VisitanteController {
    static async getAllVisitantes(req, res) {
        try {
            const visitantes = await visitanteRepository.findAllVisitantes();
            return sendSuccess(res, 200, "Visitantes obtenidos correctamente.", visitantes);
        } catch(error) {
            return sendError(res, 500, "Error al obtener visitantes.");
        }
    }

    static async getById(req, res) {
        try {
            const visitante = await visitanteRepository.findById(req.params.id);
            if(!visitante)
                return sendError(res, 404, "Visitante no encontrado.");
            return sendSuccess(res, 200, "Visitante obtenido correctamente.", visitante);
        } catch(error) {
            return sendError(res, 500, "Error al obtener visitante por ID.");
        }
    }

    static async getGroupVisitors(req, res) {
        try {
            const visitantes = await visitanteRepository.findGroupVisitors();
            return sendSuccess(res, 200, "Visitantes en grupo obtenidos correctamente.", visitantes);
        } catch(error) {
            return sendError(res, 500, "Error al obtener visitantes en grupo.");
        }
    }

    static async getIndividualVisitors(req, res) {
        try {
            const visitantes = await visitanteRepository.findIndividualVisitors();
            return sendSuccess(res, 200, "Visitantes individuales obtenidos correctamente.", visitantes);
        } catch(error) {
            return sendError(res, 500, "Error al obtener visitantes individuales.");
        }
    }

    static async getByCountry(req, res) {
        try {
            const { pais } = req.params;
            const visitantes = await visitanteRepository.findByCountry(pais);
            return sendSuccess(res, 200, `Visitantes de ${pais} obtenidos correctamente.`, visitantes);
        } catch(error) {
            return sendError(res, 500, "Error al obtener visitantes por país.");
        }
    }

    static async getByGender(req, res) {
        try {
            const { genero } = req.params;
            const visitantes = await visitanteRepository.findByGender(genero);
            return sendSuccess(res, 200, `Visitantes de género ${genero} obtenidos correctamente.`, visitantes);
        } catch(error) {
            return sendError(res, 500, "Error al obtener visitantes por género.");
        }
    }

    static async createVisitor(req, res) {
        try {
            const { 
                nombre, 
                apellido, 
                email, 
                telefono, 
                cp, 
                pais, 
                genero,
                grupo,
                cantidad_hombres,
                cantidad_mujeres,
                total_visitantes
            } = req.body;

            // Validar campos obligatorios
            if(!nombre || !apellido) {
                return sendError(res, 400, "Nombre y apellido son obligatorios.");
            }

            // Validar email único si se proporciona
            if(email) {
                const existingEmail = await visitanteRepository.findByEmail(email);
                if(existingEmail) {
                    return sendError(res, 400, "Ya existe un visitante con ese email.");
                }

                // Validar formato de email básico
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!emailRegex.test(email)) {
                    return sendError(res, 400, "Formato de email inválido.");
                }
            }

            // Validar CP si se proporciona
            if(cp && (cp < 0 || cp > 99999)) {
                return sendError(res, 400, "Código postal inválido.");
            }

            // Validar datos de grupo
            if(grupo) {
                if(!total_visitantes || total_visitantes <= 0) {
                    return sendError(res, 400, "Para grupos, el total de visitantes es obligatorio y debe ser mayor a 0.");
                }

                // Validar que la suma de hombres y mujeres coincida con el total
                const cantidadHombres = cantidad_hombres || 0;
                const cantidadMujeres = cantidad_mujeres || 0;
                
                if(cantidadHombres + cantidadMujeres !== total_visitantes) {
                    return sendError(res, 400, "La suma de hombres y mujeres debe ser igual al total de visitantes.");
                }

                if(cantidadHombres < 0 || cantidadMujeres < 0) {
                    return sendError(res, 400, "Las cantidades no pueden ser negativas.");
                }
            }

            const newVisitor = await visitanteRepository.createVisitor({ 
                nombre, 
                apellido, 
                email, 
                telefono, 
                cp, 
                pais, 
                genero,
                grupo: grupo || false,
                cantidad_hombres,
                cantidad_mujeres,
                total_visitantes
            });
            return sendSuccess(res, 201, "Visitante creado correctamente.", newVisitor);
        } catch(error) {
            return sendError(res, 500, "Error al crear visitante.");
        }
    }

    static async updateVisitor(req, res) {
        try {
            const { 
                nombre, 
                apellido, 
                email, 
                telefono, 
                cp, 
                pais, 
                genero,
                grupo,
                cantidad_hombres,
                cantidad_mujeres,
                total_visitantes
            } = req.body;

            const visitante = await visitanteRepository.findById(req.params.id);
            if(!visitante)
                return sendError(res, 404, "Visitante no encontrado.");

            // Validar email único si se proporciona y es diferente al actual
            if(email && email !== visitante.email) {
                const existingEmail = await visitanteRepository.findByEmail(email);
                if(existingEmail) {
                    return sendError(res, 400, "Ya existe un visitante con ese email.");
                }

                // Validar formato de email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!emailRegex.test(email)) {
                    return sendError(res, 400, "Formato de email inválido.");
                }
            }

            // Validar CP si se proporciona
            if(cp !== undefined && (cp < 0 || cp > 99999)) {
                return sendError(res, 400, "Código postal inválido.");
            }

            // Validar datos de grupo si se actualiza
            if(grupo !== undefined && grupo === true) {
                const totalFinal = total_visitantes !== undefined ? total_visitantes : visitante.total_visitantes;
                const cantHombres = cantidad_hombres !== undefined ? cantidad_hombres : visitante.cantidad_hombres || 0;
                const cantMujeres = cantidad_mujeres !== undefined ? cantidad_mujeres : visitante.cantidad_mujeres || 0;

                if(!totalFinal || totalFinal <= 0) {
                    return sendError(res, 400, "Para grupos, el total de visitantes es obligatorio.");
                }

                if(cantHombres + cantMujeres !== totalFinal) {
                    return sendError(res, 400, "La suma de hombres y mujeres debe ser igual al total de visitantes.");
                }
            }
            
            const updatedVisitor = await visitanteRepository.updateVisitor(req.params.id, { 
                nombre, 
                apellido, 
                email, 
                telefono, 
                cp, 
                pais, 
                genero,
                grupo,
                cantidad_hombres,
                cantidad_mujeres,
                total_visitantes
            });
            return sendSuccess(res, 200, "Visitante actualizado correctamente.", updatedVisitor);
        } catch(error) {
            return sendError(res, 500, "Error al actualizar visitante.");
        }
    }

    static async deleteVisitor(req, res) {
        try {
            const visitante = await visitanteRepository.findById(req.params.id);
            if(!visitante)
                return sendError(res, 404, "Visitante no encontrado.");
            
            await visitanteRepository.deleteVisitor(req.params.id);
            return sendSuccess(res, 200, "Visitante eliminado correctamente.");
        } catch(error) {
            return sendError(res, 500, "Error al eliminar visitante.");
        }
    }
}