const express = require('express');
const mongoose = require('mongoose');
const dotenv=require('dotenv');

dotenv.config({path:'./config.env'});
const cors = require('cors');
const bodyParser = require('body-parser');
const entryRoutes = require('./routes/entryRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// console.log(process.env.MONGO_URI)
const mongo_uri=process.env.MONGO_URI
mongoose.connect(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const Entry = require('./models/Entry');


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api/entries', entryRoutes);

const port=process.env.PORT
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
