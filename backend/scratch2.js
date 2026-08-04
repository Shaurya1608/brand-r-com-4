const mongoose = require('mongoose');
const SpeakerInterest = require('./src/models/SpeakerInterest');

const checkDb = async () => {
  try {
    // Hardcoding the DB name 'brandrcomm' or checking all DBs
    const uri = "mongodb+srv://shaurya098n_db_user:hiJIVUag6AOUEdv7@cluster0.lpjy5jh.mongodb.net/brandrcomm?appName=Cluster0";
    await mongoose.connect(uri);
    console.log('Connected to brandrcomm DB');
    
    const interests = await SpeakerInterest.find();
    console.log('Speaker Interests in brandrcomm DB:', interests.length);
    if (interests.length > 0) {
      console.log('First interest:', interests[0].fullName);
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

checkDb();
