"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
const App_jsx_1 = __importDefault(require("./App.jsx"));
const container = document.getElementById('app');
const root = (0, client_1.createRoot)(container);
root.render(<react_1.default.StrictMode>
    <App_jsx_1.default />
    </react_1.default.StrictMode>);
