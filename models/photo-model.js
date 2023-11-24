const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  title: {
        type: String,
        required: true,
      },
  photos: [
    {
      imageUrl: String,
      alt:String
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Photo", photoSchema);

