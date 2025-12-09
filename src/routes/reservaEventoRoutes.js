import express from "express";
import { ReservaEventoController } from "#controllers/reservaEventoController.js";

const router = express.Router();

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
router.post("/", ReservaEventoController.createReservaEvento);

// Update / Delete (admin)
router.put("/:id", ReservaEventoController.updateReservaEvento);
router.delete("/:id", ReservaEventoController.deleteReservaEvento);

// Fetch by ID (siempre la ÚLTIMA ruta dinámica)
router.get("/:id", ReservaEventoController.getReservaEventoById);

export default router;
