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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env.local" });
var prompts_1 = require("@inquirer/prompts");
var mongodb_1 = require("mongodb");
var mongoose_1 = require("mongoose");
var Users_1 = require("../src/app/_db/models/Users");
var EMAIL_PATTERN = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
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
var extractEmails = function (input) {
    // @ts-ignore
    var emails = __spreadArray([], input.toLowerCase().matchAll(EMAIL_PATTERN), true).map(function (match) { return match[0]; });
    var remaining = input;
    for (var _i = 0, emails_1 = emails; _i < emails_1.length; _i++) {
        var email = emails_1[_i];
        // Replace exact matches, globally
        remaining = remaining.replace(new RegExp(email, "g"), "").trim();
    }
    return {
        emails: emails,
        remaining: remaining.replace(/\s+/g, " "), // normalize spaces
    };
};
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var MONGODB_URI, opts, inputted, emails, foundEmailDocs, foundEmails, newUsers;
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
                    return [4 /*yield*/, (0, prompts_1.input)({
                            message: "Input emails seperated by spaces. ",
                            required: true,
                        })];
                case 2:
                    inputted = _a.sent();
                    emails = extractEmails(inputted).emails;
                    if (emails.length == 0)
                        return [2 /*return*/, console.log("No Valid Emails Entered.")];
                    return [4 /*yield*/, Users_1.default.find({
                            email: { $in: emails },
                        })];
                case 3:
                    foundEmailDocs = _a.sent();
                    foundEmails = new Set(foundEmailDocs.map(function (doc) { return doc.email; }));
                    newUsers = emails
                        .filter(function (email) { return !foundEmails.has(email.toString()); })
                        .map(function (email) { return ({
                        email: email,
                        linked: false,
                        deleted: false,
                        role: "Student",
                    }); });
                    if (!(newUsers.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, Users_1.default.collection.insertMany(newUsers, { ordered: false })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    console.log("Nothing new to create");
                    _a.label = 6;
                case 6:
                    console.log("Success!");
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
main();
