const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

var http = require('http')
var socketio = require('socket.io');
var server = http.Server(app);
var websocket = socketio(server);
server.listen(3000, () => console.log('listening on *:3000'));

var models = require('./models');
var User = models.User;
var Group = models.Group;
var Bill = models.Bill;
var Chore = models.Chore;


mongoose.connect(process.env.MONGODB_URI);

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_EM,
    pass: process.env.GOOGLE_PW
  }
});


const session = require('cookie-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');

// Passport Strategies
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
const FacebookStrategy = require('passport-facebook');

// set passport middleware to first try local strategy
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// passport strategy
passport.use(new LocalStrategy((username, password, done) => {
  // Find the user with the given username
  console.log("ATTEMPT");
  User.findOne({ email: username }, (err, user) => {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) {
      console.log(err);
      return done(err);
    }
    // if no user present, auth failed
    if (!user) {
      console.log(user);
      return done(null, false, { message: 'Incorrect username.' });
    }
    // if passwords do not match, auth failed
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    // auth has has succeeded
    console.log("GOOOOD");
    return done(null, user);
  });
}));

// connect passport to express via express middleware
app.use(passport.initialize());
app.use(passport.session());


app.post('/login', passport.authenticate('local'), (req, res) => {
  console.log("req", req.user);
  res.json({success: true, userInfo: req.user});
});

app.post('/logout', (req, res) => {
  req.logout();
  res.json({success: true})
})

app.post('/signup', (req, res) => {
  console.log('Signup: ', req.body.email)
  var newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
  newUser.save()
    .then((saved) => {
      console.log("Successfully signed up");
      res.json({success: true, id: saved._id});
    })
    .catch((err) => {
      console.log("Failed to sign up: ", err);
    })
});

app.get('/allusers', (req, res) => {
  console.log("Loadingggg users");
  User.find()
    .then((users) => {
      res.json({success: true, users: users})
      console.log("users: ", users);
    })
    .catch((err) => {
      console.log("Error in getting users ", err);
    })
})

app.get('/group/info/:id', (req, res) => {
  console.log("Loading a group");
  Group.findById(req.params.id)
    .then((group) => {
      console.log("Group: ", group);
      res.json({success: true, group: group})
    })
    .catch((err) => {
      console.log("Error in getting a group ", err);
    })
})

app.get('/bill/info/:id', (req, res) => {
  console.log("Loading a bill");
  Bill.findById(req.params.id)
    .then((bill) => {
      console.log("Bill: ", bill);
      res.json({success: true, bill: bill})
    })
    .catch((err) => {
      console.log("Error in getting a bill", err);
    })
})

app.get('/chore/info/:id', (req, res) => {
  console.log("Loading a chore");
  Chore.findById(req.params.id)
    .then((chore) => {
      console.log("Chore: ", chore);
      res.json({success: true, chore: chore})
    })
    .catch((err) => {
      console.log("Error in getting a chore", err);
    })
})

app.post('/friend/add/:id', (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      var friend = {
        name: req.body.name,
        email: req.body.email,
        id: req.body.id
      }
      user.friends.push(friend);
      return user.save()
    })
    .then((saved) => {
      console.log("Successfully added a friend and updated: ", saved);
      res.json({success: true, user: saved})
    })
})

app.post('/friend/delete/:id', (req, res) => {
  var friends = [];
  User.findById(req.body.userId)
    .then((user) => {
      console.log("User with this id: ", user);
      friends = user.friends.filter((friend) => {
        console.log("param(given id): ", typeof(req.params.id));
        console.log("friend.id: ", typeof(friend.id.toString()));
        console.log("friend.id = req.params.id? ", friend.id.toString() === req.params.id);
        return friend.id.toString() !== req.params.id
      });
      user.friends = friends; // update the user info
      return user.save()
    })
    .then((saved) => {
      console.log("saving the updated user and groups: ", saved, friends);
      res.json({success: true, user: saved, friends: friends})
    })
})


app.post('/group/add/:id', (req, res) => {
  console.log('Adding group ', req.params.id);
  var arr = [];
  arr.push(req.body.member);
  var newGroup = new Group({
    title: req.body.title,
    members: arr,
    bills: [],
    chores: []
  });
  var group = {};
  newGroup.save()
    .then((saved) => {
      console.log("Successfully added a group: ", saved);
      group.id = saved._id.toString(),
      group.name = saved.title
      return User.findById(req.params.id)
    })
    .then((user) => {
      user.groups.push(group);
      return user.save()
    })
    .then((updated) => {
      console.log("Successfully updated a group to a user: ", updated);
      res.json({success: true, group: group})
    })
})

app.post('/group/delete/:id', (req, res) => {
  var groups = [];
  // remove yourself from the group as well
  Group.findById(req.params.id)
    .then((group) => {
      group.members = group.members.filter((item) => {
        return item.id !== req.body.userId
      })
      group.save();
      return User.findById(req.body.userId)
    })
    .then((user) => {
      console.log("User with this id: ", user);
      groups = user.groups.filter((group) => {
        console.log("param: ", typeof(req.params.id));
        console.log("group.id: ", typeof(group.id.toString()));
        console.log("group.id = req.params.id? ", group.id.toString() === req.params.id);
        return group.id.toString() !== req.params.id
      });
      user.groups = groups; // update the user info
      return user.save()
    })
    .then((saved) => {
      console.log("saving the updated user and groups: ", saved, groups);
      res.json({success: true, user: saved, groups: groups})
    })
})

app.post('/group/invite/:id', (req, res) => {
  // req.params.id is a friend id
  // req.body.groupdId is a group id
  Group.findById(req.body.group._id)
    .then((group) => {
      group.members.push(req.body.friend);
      return group.save()
    })
    .then((saved) => {
      console.log("Successfully added a member and updated: ", saved);
      return User.findById(req.params.id)
    })
    .then((user) => {
      var obj = {
        name: req.body.group.title,
        id: req.body.group._id
      }
      user.groups.push(obj)
      user.save()
      res.json({success: true, invitee: req.body.friend})
    })
})


app.post('/group/leave/:id', (req, res) => {
  // req.params.id is a user id
  // req.body.groupdId is a group id
  var groups = [];
  Group.findById(req.body.groupId)
    .then((group) => {
      group.members = group.members.filter((item) => {
        return item.id.toString() !== req.params.id.toString()
      })
      group.save();
      return User.findById(req.params.id)
    })
    .then((user) => {
      groups = user.groups.filter((group) => {
        return req.body.groupId.toString() !== group.id.toString()
      });
      user.groups = groups; // update the user info
      return user.save()
    })
    .then((saved) => {
      console.log("Successfully left this group: ", saved);
      res.json({success: true, user: saved})
    })
})


app.post('/bill/add/:id', (req, res) => {
  var newBill = new Bill({
    title: req.body.bill.title,
    total: req.body.bill.total,
    participants: req.body.bill.participants,
    payer: {
      name: req.body.bill.payer.name,
      email: req.body.bill.payer.email,
      id: req.body.bill.payer._id
    },
    date: req.body.bill.date,
    group: {
      name: req.body.bill.group.name,
      id: req.body.bill.group.id
    },
    image: req.body.bill.image,
    note: req.body.bill.note
  })
  var bill = {};
  newBill.save()
    .then((saved) => {
      console.log("New bill is saved ", saved);
      bill = saved;
      return Group.findById(req.params.id)
    })
    .then((group) => {
      group.bills.push(bill)
      return group.save()
    })
    .then(() => {
      res.json({success: true, bill: bill})
    })
    .catch((err) => {
      console.log("Error in adding a bill ", err);
    })
})

app.post('/bill/update/image/:id', (req, res) => {
  Bill.findById(req.params.id)
    .then((bill) => {
      bill.image = req.body.image;
      return bill.save()
    })
    .then((saved) => {
      console.log('Successfully updated a image to a bill', saved);
    })
    .catch((err) => {
      console.log("there was an error in updating a iamge ", err);
    })
})

app.post('/bill/edit/:id', (req, res) => {
  var updated = {};
  Bill.findById(req.body.bill._id)
    .then((bill) => {
      bill.title = req.body.bill.title;
      bill.total = req.body.bill.total;
      bill.participants = req.body.bill.participants;
      bill.date = req.body.bill.date;
      bill.image = req.body.bill.image;
      bill.note = req.body.bill.note;
      bill.save()
      updated = bill;
      return Group.findById(req.params.id)
    })
    .then((group) => {
      var bills = group.bills.filter((bill) => {
        console.log("bill id ", req.body.bill._id);
        return bill._id.toString() !== req.body.bill._id
      });
      group.bills = bills;
      group.bills.push(updated);
      return group.save();
    })
    .then((saved) => {
      console.log("successfully edited a bill ", saved, updated);
      res.json({success: true, group: saved, bill: updated})
    })
})

app.post('/bill/delete/:id', (req, res) => {
  var bills = [];
  Bill.findByIdAndRemove(req.params.id)
    .then(() => {
      return Group.findById(req.body.groupId)
    })
    .then((group) => {
      bills = group.bills.filter((bill) => {
        console.log("param(given id): ", typeof(req.params.id));
        console.log("bill.id: ", typeof(bill._id.toString()));
        console.log("bill.id = req.params.id? ", bill._id.toString() === req.params.id);
        return bill._id.toString() !== req.params.id
      });
      group.bills = bills;
      return group.save()
    })
    .then((saved) => {
      console.log('Successfully updated a group by deleting this bill', bills, saved);
      res.json({success: true, group: saved, bills: bills})
    })
    .catch((err) => {
      console.log("there was an error in deleting a bill ", err);
    })
})

app.post('/chore/add/:id', (req, res) => {
  var newChore = new Chore({
    title: req.body.chore.title,
    inCharge: req.body.chore.inCharge,
    date: req.body.chore.date,
    group: {
      name: req.body.chore.group.name,
      id: req.body.chore.group.id
    },
    note: req.body.chore.note,
    done: false,
    image: req.body.chore.image
  })
  var chore = {};
  newChore.save()
    .then((saved) => {
      console.log("New chore is saved ", saved);
      chore = saved;
      return Group.findById(req.params.id)
    })
    .then((group) => {
      group.chores.push(chore)
      return group.save()
    })
    .then(() => {
      res.json({success: true, chore: chore})
    })
    .catch((err) => {
      console.log("Error in adding a chore ", err);
    })
})

app.post('/chore/update/image/:id', (req, res) => {
  Chore.findById(req.params.id)
    .then((chore) => {
      chore.image = req.body.image;
      return chore.save()
    })
    .then((saved) => {
      console.log('Successfully updated a image to a chore', saved);
    })
    .catch((err) => {
      console.log("there was an error in updating a iamge ", err);
    })
})

app.post('/chore/edit/:id', (req, res) => {
  var updated = {};
  Chore.findById(req.body.chore._id)
    .then((chore) => {
      chore.title = req.body.chore.title;
      chore.inCharge = req.body.chore.inCharge;
      chore.date = req.body.chore.date;
      chore.image = req.body.chore.image;
      chore.note = req.body.chore.note;
      chore.save()
      updated = chore;
      return Group.findById(req.params.id)
    })
    .then((group) => {
      var chores = group.chores.filter((chore) => {
        return chore._id.toString() !== req.body.chore._id
      });
      group.chores = chores;
      group.chores.push(updated);
      return group.save();
    })
    .then((saved) => {
      console.log("successfully edited a chore ", saved, updated);
      res.json({success: true, group: saved, chore: updated})
    })
})


app.post('/chore/delete/:id', (req, res) => {
  var chores = [];
  Chore.findByIdAndRemove(req.params.id)
    .then(() => {
      return Group.findById(req.body.groupId)
    })
    .then((group) => {
      chores = group.chores.filter((chore) => {
        return chore._id.toString() !== req.params.id
      });
      group.chores = chores;
      return group.save()
    })
    .then((saved) => {
      console.log('Successfully updated a group by deleting this chore', chores, saved);
      res.json({success: true, group: saved, chores: chores})
    })
    .catch((err) => {
      console.log("there was an error in deleting a bill ", err);
    })
})


app.post('/send/request', (req, res) => {
  const mailOptions = {
    from: 'Shareliving',
    to: req.body.participant.email,
    subject: 'Payment Request',
    text: `${req.body.from} asked you to pay $${req.body.amount}`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.json({success: true})
    }
  });
})

app.post('/send/reminder', (req, res) => {
  const mailOptions = {
    from: 'Shareliving',
    to: req.body.inCharge.email,
    subject: 'House Chore Reminder',
    text: `${req.body.from} sent you a reminder to do "${req.body.task}"`
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.json({success: true})
    }
  });
})


app.get('/user/:id', (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      res.json({success: true, user: user})
    })
})

websocket.on('connection', (socket) => {

});
