"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const visitaController_1 = require("../controllers/visitaController");
const router = express_1.default.Router();
router.post("/visita", visitaController_1.createVisita);
router.get("/visitas", visitaController_1.getVisitas);
router.put("/visita/:id", visitaController_1.updateVisita);
router.delete("/visita/:id", visitaController_1.deleteVisita);
exports.default = router;
