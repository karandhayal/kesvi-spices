const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  googleMapsUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('City', CitySchema);