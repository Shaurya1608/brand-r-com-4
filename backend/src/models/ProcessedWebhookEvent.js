const mongoose = require('mongoose');

const processedWebhookEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  eventType: {
    type: String,
  },
  processedAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60, // Auto-expire event IDs from DB after 7 days (TTL Index)
  }
});

module.exports = mongoose.model('ProcessedWebhookEvent', processedWebhookEventSchema);
