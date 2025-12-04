const express = require("express");
const { ColorModal } = require("../models/colors");

const router = express.Router();

// router.post("/create", async (req, res) => {
//   try {
//     const response = await fetch("https://csscolorsapi.com/api/colors");
//     const json = await response.json();

//     if (!json.colors || !Array.isArray(json.colors)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid API response",
//       });
//     }

//     // Insert all colors directly
//     const saved = await ColorModal.insertMany(json.colors);

//     return res.status(200).json({
//       success: true,
//       message: "Colors saved successfully",
//       total: saved.length,
//       data: saved,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Server error: " + err.message,
//     });
//   }
// });

router.post("/create", async (req, res) => {
  try {
    const { name, hex, theme, group, rgb, isActive } = req.body;

    const newColor = new ColorModal({
      name,
      hex,
      theme,
      group,
      rgb: rgb || null,
      isActive: isActive ?? true,
      createdBy: req.userId,
      updatedBy: req.userId,
    });

    await newColor.save();

    return res.status(200).json({
      success: true,
      message: `New color created`,
      data: newColor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong on a server ${err}`,
      data: {},
    });
  }
});

router.post("/create-gradient", async (req, res) => {
  try {
    const { grad1, grad2 } = req.body;

    // Calculate mixed color (midpoint) as generated color
    const mixColors = (hex1, hex2) => {
      const r1 = parseInt(hex1.substring(0, 2), 16);
      const g1 = parseInt(hex1.substring(2, 4), 16);
      const b1 = parseInt(hex1.substring(4, 6), 16);

      const r2 = parseInt(hex2.substring(0, 2), 16);
      const g2 = parseInt(hex2.substring(2, 4), 16);
      const b2 = parseInt(hex2.substring(4, 6), 16);

      const r = Math.round((r1 + r2) / 2);
      const g = Math.round((g1 + g2) / 2);
      const b = Math.round((b1 + b2) / 2);

      return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const mixedHex = mixColors(grad1, grad2);

    // Save gradient object in DB
    const newGradient = new ColorModal({
      name: `Gradient ${grad1}-${grad2}`,
      hex: mixedHex, // store the generated color
      theme: "Gradient",
      group: "Generated",
      rgb: null,
      gradientColors: [grad1, grad2, mixedHex], // optional: store all colors
      isActive: true,
      createdBy: req.userId,
      updatedBy: req.userId,
    });

    await newGradient.save();

    return res.status(200).json({
      success: true,
      message: "Gradient saved successfully",
      data: newGradient,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server error: ${err.message}`,
    });
  }
});

// router.post("/create", async (req, res) => {
//   try {
//     const { name, hex, luminance, rgb, isActive } = req.body;

//     const newColor = new ColorModal({
//       name,
//       hex,
//       luminance: luminance || null,
//       rgb: rgb || null, // { r, g, b }
//       isActive: isActive ?? true,
//       createdBy: req.userId,
//       updatedBy: req.userId,
//     });

//     await newColor.save();

//     return res.status(200).json({
//       success: true,
//       message: `New color created`,
//       data: newColor,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: `Something went wrong on a server ${err}`,
//       data: {},
//     });
//   }
// });

router.get("/read", async (req, res) => {
  try {
    const allColor = await ColorModal.find({
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      message: `allColor found`,
      data: allColor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong on a server ${err}`,
      data: {},
    });
  }
});

router.patch("/delete", async (req, res) => {
  try {
    const { id } = req.body;

    const isExistBefore = await ColorModal.findOne({
      _id: req.body.id,
    });

    if (!isExistBefore)
      return res.status(404).json({
        success: false,
        message: "Color data not found",
        data: {},
      });

    const updatedColor = await ColorModal.findOneAndUpdate(
      {
        _id: req.body.id,
      },
      {
        isActive: false,
        isDeleted: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: `Color data updated`,
      data: updatedColor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Something went wrong on a server ${err}`,
      data: {},
    });
  }
});

module.exports = router;
