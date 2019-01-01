const mongoose = require('mongoose');
const connect = process.env.MONGODB_URI;
mongoose.connect(connect);

if (!process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}


const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  friends: {
    type: Array
  },
  groups: {
    type: Array
  }
})



const groupSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  members: {
    type: Array,
    required: true
  },
  chores: {
    type: Array
  },
  bills: {
    type: Array
  }

})


const billSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  payer: {
    type: Object,
    required: true
  },
  participants: {
    type: Array,
    required: true
  },
  total: { // total amount of paid
    type: Number,
    required: true
  },
  group: { // belongs to
    type: Object,
    required: true
  },
  items: { // items that are bought
    type: Array
  },
  image: {
    type: String // String stores the path to the image.
  },
  note: {
    type: String
  }
})

const choreSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  inCharge: {
    type: Array,
    required: true
  },
  done: {
    type: Boolean,
  },
  group: { // belongs to
    type: Object,
    required: true
  },
  note: {
    type: String
  }
})

const User = mongoose.model('User', userSchema);
const Group = mongoose.model('Group', groupSchema);
const Bill = mongoose.model('Bill', billSchema);
const Chore = mongoose.model('Chore', choreSchema);

module.exports = {
  User,
  Group,
  Bill,
  Chore
};
