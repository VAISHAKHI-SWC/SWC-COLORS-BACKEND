const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
  {
    name: String,
    theme: String,
    group: String,
    hex: String,
    shades: {
      type: Map,
      of: String,
    },

    clickCount: {
      type: Number,
      default: 0,
    },

    rgb: {
      r: Number,
      g: Number,
      b: Number,
    },
    count: { type: Number },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ColorModal = mongoose.model("ColorModal", colorSchema);
module.exports = { colorSchema, ColorModal };
