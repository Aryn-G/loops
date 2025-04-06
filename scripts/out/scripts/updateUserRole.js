"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env.local" });
var prompts_1 = require("@inquirer/prompts");
var mongodb_1 = require("mongodb");
var mongoose_1 = require("mongoose");
var Users_1 = require("../src/app/_db/models/Users");
process.on("SIGINT", function () {
    console.log("\nClosing Terminal...");
    process.exit(0);
});
process.on("uncaughtException", function (error) {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
process.on("unhandledRejection", function (reason) {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var MONGODB_URI, opts, allUsers, user, updatedRole, confirmation;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Connecting to MongoDB...");
                    MONGODB_URI = process.env.MONGODB_URI;
                    opts = {
                        bufferCommands: false,
                        serverApi: {
                            version: mongodb_1.ServerApiVersion.v1,
                            strict: true,
                            deprecationErrors: true,
                        },
                    };
                    return [4 /*yield*/, mongoose_1.default.connect(MONGODB_URI, opts)];
                case 1:
                    _a.sent();
                    console.log("Loading Users...");
                    return [4 /*yield*/, Users_1.default.find({})];
                case 2:
                    allUsers = (_a.sent()).map(function (user) {
                        return {
                            _id: String(user._id),
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            picture: user.picture,
                        };
                    });
                    return [4 /*yield*/, (0, prompts_1.search)({
                            message: "Search for a User to update:",
                            source: function (input_1, _a) { return __awaiter(_this, [input_1, _a], void 0, function (input, _b) {
                                var signal = _b.signal;
                                return __generator(this, function (_c) {
                                    if (!input) {
                                        return [2 /*return*/, []];
                                    }
                                    return [2 /*return*/, allUsers
                                            .filter(function (user) {
                                            return user.email.toLowerCase().includes(input.toLowerCase()) ||
                                                user.name.toLowerCase().includes(input.toLowerCase());
                                        })
                                            .map(function (user) { return ({
                                            name: "(".concat(user.role, " Account) - ").concat(user.name),
                                            value: user,
                                            description: "(".concat(user.role, " Account) - ").concat(user.name, " (").concat(user.email, ")"),
                                        }); })];
                                });
                            }); },
                        })];
                case 3:
                    user = _a.sent();
                    return [4 /*yield*/, (0, prompts_1.select)({
                            message: "Update selected user to:",
                            choices: [
                                {
                                    name: "Student Account",
                                    value: "Student",
                                    description: "This is the default account type.",
                                },
                                {
                                    name: "Loops Account",
                                    value: "Loops",
                                    description: "This account can create loops and manage student groups.",
                                },
                                {
                                    name: "Admin Account",
                                    value: "Admin",
                                    description: "This account can create loops, manage student groups, and also manage Loops Accounts.",
                                },
                            ],
                        })];
                case 4:
                    updatedRole = _a.sent();
                    if (updatedRole === user.role) {
                        console.log("Previous role and new role are the same.");
                        process.exit(0);
                    }
                    confirmation = true;
                    if (!(updatedRole === "Admin")) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, prompts_1.confirm)({
                            message: "Are you sure you want to grant this account Admin permissions?",
                            default: false,
                        })];
                case 5:
                    confirmation = _a.sent();
                    _a.label = 6;
                case 6:
                    if (!confirmation) {
                        console.log("Canceled!");
                        process.exit(0);
                    }
                    return [4 /*yield*/, Users_1.default.findOneAndUpdate({ _id: user._id }, { $set: { role: updatedRole } })];
                case 7:
                    _a.sent();
                    console.log("Success!");
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
main();
