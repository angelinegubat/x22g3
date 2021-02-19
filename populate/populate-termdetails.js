const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const TermDetails = require('../models/term-details');
const connect = require('../config/db-config');


/**
 * Populates the term details collection in the database.
 * This is called in ./index.js
 */
module.exports = async () => {
  try {
    // read term-details.json file contents
    console.log('Reading accounts.json...');
    const buffer = fs.readFileSync(
      path.resolve(__dirname, '../data/term-details.json'),
    );
    console.log('Successfully read file contents.');

    console.log('Converting buffer to object...');
    const termdetails = JSON.parse(buffer);
    console.log('Successfully converted.');

    // connect to db
    console.log('Connecting to database...');
    await connect();

    // loop through each account
    for (let i = 0; i < termdetails.length; i++) {
      const termdetail = termdetails[i];

      const savedDetail = await TermDetails.findOne({
        _id: termdetail._id,
        
      });

      if (savedDetail) {
        console.log(`Skipping term detail with ID ${termdetail._id}`);
      } else {
        console.log('Creating term detail...');
        
        await TermDetails.create(termdetail);
        console.log('Term Detail created.');
      }
    }

    // close the connection
    await mongoose.connection.close();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
