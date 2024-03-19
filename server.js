const path = require('path');
const express = require('express');
const multer = require('multer');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./routes');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    }),
};
// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Generate unique file names
    }
  });
  const upload = multer({ storage: storage });

//routes
app.use(session(sess));
app.use(routes);

// Handle file uploads
app.post('/upload', upload.single('image'), (req, res) => {
  // File uploaded successfully, handle further processing here
  res.send('File uploaded successfully');
});

const hbs = exphbs.create({helpers})
//view engine setup
app.engine('handlebars', hbs.engine)
app.set('view engine', 'hbs');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Render the 'addListing' template when accessing the '/add' route
app.get('/add', (req, res) => {
    res.render('addListing');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
