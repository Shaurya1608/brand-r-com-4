require('dotenv').config();
const mongoose = require('mongoose');

const DelegateRegistration = require('../src/models/DelegateRegistration');
const AwardNomination = require('../src/models/AwardNomination');
const Sponsorship = require('../src/models/Sponsorship');
const SpeakerInterest = require('../src/models/SpeakerInterest');
const ProcessedWebhookEvent = require('../src/models/ProcessedWebhookEvent');

async function clearDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI is not set in environment!');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    console.log('Clearing all Delegate Registrations...');
    const delRes = await DelegateRegistration.deleteMany({});
    console.log(`Deleted ${delRes.deletedCount} Delegate Registrations.`);

    console.log('Clearing all Award Nominations...');
    const nomRes = await AwardNomination.deleteMany({});
    console.log(`Deleted ${nomRes.deletedCount} Award Nominations.`);

    console.log('Clearing all Sponsorship Bookings...');
    const sponRes = await Sponsorship.deleteMany({});
    console.log(`Deleted ${sponRes.deletedCount} Sponsorships.`);

    console.log('Clearing all Speaker Interest Enquiries...');
    const spkRes = await SpeakerInterest.deleteMany({});
    console.log(`Deleted ${spkRes.deletedCount} Speaker Interests.`);

    console.log('Clearing all Processed Webhook Events...');
    const webRes = await ProcessedWebhookEvent.deleteMany({});
    console.log(`Deleted ${webRes.deletedCount} Webhook Events.`);

    console.log('-------------------------------------------');
    console.log('ALL USER DATA & ENQUIRIES SUCCESSFULLY CLEARED FROM DATABASE!');
    console.log('-------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();
