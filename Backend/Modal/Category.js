const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
    category: {
        type: String,
    },
    percentages: {
        type: Number,
    }
});
module.exports = mongoose.model("categories", CategorySchema);