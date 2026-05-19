const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  phone: { type: String },
  timings: { type: String },
  lat: { type: Number, required: true }, // Latitude
  lng: { type: Number, required: true }, // Longitude
  googleMapsUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Store', StoreSchema);