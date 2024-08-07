const express = require("express");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const path = require("path");
const app = express();

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid name conflicts
    }
});
const upload = multer({ storage: storage });

// Route to display the form
app.get('/', (req, res) => {
    res.render('form', { errors: [] });
});

// Route to handle form submission
app.post('/user/new', 
    upload.single('image'), 
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('age').isInt().withMessage('Age must be a number'),
        body('email').isEmail().withMessage('Invalid email address'),
    ], 
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('form', { errors: errors.array() });
        }

        // Store user data in memory for demonstration purposes
        const user = {
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            image: req.file ? `/uploads/${req.file.filename}` : ''
        };

        res.render('user', { user });
    }
);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
