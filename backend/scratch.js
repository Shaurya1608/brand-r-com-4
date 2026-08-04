const mongoose = require('mongoose');
const SpeakerInterest = require('./src/models/SpeakerInterest');

require('dotenv').config({ path: './.env' });

const checkDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const interests = await SpeakerInterest.find();
    console.log('Speaker Interests in DB:', interests.length);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name).join(', '));
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

checkDb();
