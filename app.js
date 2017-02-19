var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator')
var path = require('path');

var app = express();
// Middleware logger example
// var logger = function (req, res, next) {
//   console.log('logging');
//     next();
// };
//
// app.use(logger);

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(function (req, res, next) {
  res.locals.errors = null;
  next();
});

// Express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Set static path

app.use(express.static(path.join(__dirname, 'public')));

var users = [
  {
    firstName: 'Alex',
    lastName: 'Mokac'
  },
  {
    firstName: 'Tex',
    lastName: 'Viler'
  }
]

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Customers',
    users: users
  });
});

app.post('/users/add', function (req, res) {
  req.checkBody('first_name', 'First name is required').notEmpty();
  req.checkBody('last_name', 'Last name is required').notEmpty();

  var errors = req.validationErrors();
  if(errors){
    res.render('index', {
      title: 'Customers',
      users: users,
      errors: errors
    });
  } else {
    var newUser = {
      firstName: req.body.first_name,
      lastName: req.body.last_name
    }
    console.log('Success');
  }

});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});


