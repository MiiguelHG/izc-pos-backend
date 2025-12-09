import express from "express";
import { ProductoVentaController } from "../controllers/productoVentaController.js";
import { authJwt } from "../middlewares/index.js";

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     ProductoVentaItem:
 *       type: object
 *       properties:
 *         productoId:
 *           type: integer
 *           example: 1
 *         cantidad:
 *           type: integer
 *           example: 2
 *         precio:
 *           type: number
 *           format: float
 *           example: 45.50
 *     CreateVentaProductosCompleta:
 *       type: object
 *       required:
 *         - total
 *         - carritoProductos
 *         - museoId
 *         - usuarioId
 *         - formaPagoId
 *       properties:
 *         total:
 *           type: number
 *           format: float
 *           example: 91.00
 *         carritoProductos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductoVentaItem'
 *         museoId:
 *           type: integer
 *           example: 1
 *         usuarioId:
 *           type: integer
 *           example: 2
 *         formaPagoId:
 *           type: integer
 *           example: 1
 *     ProductoVentaResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         total:
 *           type: number
 *           format: float
 *           example: 91.00
 *         museoId:
 *           type: integer
 *         usuarioId:
 *           type: integer
 *         formaPagoId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 */

/**
 * @openapi
 * /api/producto-ventas:
 *   post:
 *     summary: Create a complete product sale (venta de productos)
 *     tags:
 *       - ProductoVentas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVentaProductosCompleta'
 *     responses:
 *       201:
 *         description: Venta creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductoVentaResponse'
 *       400:
 *         description: Bad request
 */
router.post("/", ProductoVentaController.createVentaProductosCompleta);

/**
 * @openapi
 * /api/producto-ventas:
 *   get:
 *     summary: Get paginated list of product sales
 *     tags:
 *       - ProductoVentas
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *     responses:
 *       200:
 *         description: Lista de ventas
 *       404:
 *         description: No se encontraron ventas
 */
router.get("/", ProductoVentaController.getAllProductoVentas);

/**
 * @openapi
 * /api/producto-ventas/{id}:
 *   get:
 *     summary: Get a product sale by id
 *     tags:
 *       - ProductoVentas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Venta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductoVentaResponse'
 *       404:
 *         description: Venta no encontrada
 */
router.get("/:id", ProductoVentaController.getProductoVentaById);

/**
 * @openapi
 * /api/producto-ventas/museo/{museoId}:
 *   get:
 *     summary: Get product sales filtered by museoId (paginated)
 *     tags:
 *       - ProductoVentas
 *     parameters:
 *       - in: path
 *         name: museoId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *     responses:
 *       200:
 *         description: Ventas por museo
 *       404:
 *         description: No se encontraron ventas para este museo
 */
router.get("/museo/:museoId", ProductoVentaController.getAllProductoVentasByMuseoId);

export default router;