"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customers_1 = __importDefault(require("./customers"));
const swagger_1 = __importDefault(require("./swagger"));
const router = express_1.default.Router();
router.use('/customers', customers_1.default);
router.use('/', swagger_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map