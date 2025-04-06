"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var LoopSchema = new mongoose_1.default.Schema({
    createdBy: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Users",
        required: true,
    },
    loopNumber: { type: Number, default: 0, required: false },
    // date: { type: Date, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    departureDateTime: { type: Date, required: true },
    departureLocation: { type: String, required: true },
    pickUpDateTime: { type: Date, required: true },
    pickUpLocation: { type: String, default: "", required: false },
    approxDriveTime: { type: Number, required: true },
    capacity: { type: Number, required: true },
    reservations: {
        type: [
            {
                type: {
                    slots: { type: Number },
                    group: {
                        type: mongoose_1.default.Schema.ObjectId,
                        ref: "Group",
                    },
                },
            },
        ],
        default: [],
    },
    filled: {
        type: [{ type: mongoose_1.default.Schema.ObjectId, ref: "SignUp" }],
        default: [],
    },
    signUpOpenDateTime: { type: Date, required: true },
    published: {
        type: Boolean,
        default: true,
    },
    canceled: {
        type: Boolean,
        default: false,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    createdAt: { type: Date, required: true },
});
exports.default = mongoose_1.default.models.Loop ||
    mongoose_1.default.model("Loop", LoopSchema);
