"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const config_1 = require("./config");
const app = (0, express_1.default)();
(0, mongoose_1.connect)(config_1.MONGO)
    .then(() => {
    console.log('Вы подключились к БД');
})
    .catch(err => {
    throw err;
});
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.send('Ok');
});
app.listen(config_1.PORT, () => console.log('Сервер запущен'));
