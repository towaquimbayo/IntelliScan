"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const user_1 = require("../messages/lang/en/user");
const notFound = (_, res) => res.status(404).send({ message: user_1.messages.noRouteExists });
exports.notFound = notFound;
