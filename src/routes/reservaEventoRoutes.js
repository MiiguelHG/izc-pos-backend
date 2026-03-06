import express from "express";
import { validarReserva, validarActualizacionReserva } from "#middlewares/reservaEventoMiddleware.js";
import { authJwt } from "#middlewares/authJwt.js";
import { ReservaEventoController } from "#controllers/reservaEventoController.js";

const router = express.Router();

router.use(authJwt.verifyToken);

// List / fetch
router.get("/", ReservaEventoController.getReservasEvento);

// Custom queries (rutas específicas antes que cualquier ":param")
router.get("/rango-fechas", ReservaEventoController.obtenerPorRangoFechas);
router.get("/disponibilidad", ReservaEventoController.validarDisponibilidad);
router.get("/contar/:fecha", ReservaEventoController.contarReservasPorDia);

// Filters
router.get("/dia/:fecha", ReservaEventoController.obtenerPorDia);
router.get("/museo/:museoId", ReservaEventoController.obtenerPorMuseo);
router.get("/articulo/:articuloId", ReservaEventoController.obtenerPorArticulo);

// Actions
router.post("/:id/cancelar", ReservaEventoController.cancelarEvento);
router.post("/:id/asistido", ReservaEventoController.marcarComoAsistido);

// Create (authenticated users)
router.get("/",ReservaEventoController.getReservasEvento);
router.post("/", validarReserva, ReservaEventoController.createReservaEvento);

// Update / Delete (admin)
router.put("/:id", validarActualizacionReserva, ReservaEventoController.updateReservaEvento);
router.delete("/:id", ReservaEventoController.deleteReservaEvento);

// Fetch by ID (siempre la ÚLTIMA ruta dinámica)
router.get("/:id", ReservaEventoController.getReservaEventoById);

export default router;
