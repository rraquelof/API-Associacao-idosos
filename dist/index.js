"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const idosoRoutes_1 = __importDefault(require("./routes/idosoRoutes"));
const eventoRoutes_1 = __importDefault(require("./routes/eventoRoutes"));
const mongo_1 = require("./database/mongo");
const error_1 = require("./middlewares/error");
const acompanhamentoRoutes_1 = __importDefault(require("./routes/acompanhamentoRoutes"));
const saudeRoutes_1 = __importDefault(require("./routes/saudeRoutes"));
const visitaRoutes_1 = __importDefault(require("./routes/visitaRoutes"));
const swaggerDocs = require("../swagger.json");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/uploads", express_1.default.static("uploads"));
app.use('/api', userRoutes_1.default, idosoRoutes_1.default, eventoRoutes_1.default, acompanhamentoRoutes_1.default, saudeRoutes_1.default, visitaRoutes_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use(error_1.errorHandler);
const PORT = process.env.PORT || 3333;
(0, mongo_1.conectar)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
})
    .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
});
