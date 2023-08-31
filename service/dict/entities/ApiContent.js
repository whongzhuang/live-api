"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiContent = void 0;
const typeorm_1 = require("typeorm");
let ApiContent = exports.ApiContent = class ApiContent {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], ApiContent.prototype, "api_id", void 0);
__decorate([
    (0, typeorm_1.Column)()
], ApiContent.prototype, "in_json", void 0);
__decorate([
    (0, typeorm_1.Column)()
], ApiContent.prototype, "out_json", void 0);
__decorate([
    (0, typeorm_1.Column)()
], ApiContent.prototype, "last_update_time", void 0);
exports.ApiContent = ApiContent = __decorate([
    (0, typeorm_1.Entity)({ database: "api_content" })
], ApiContent);
