const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 9000;

const uri = process.env.MONGO_DB_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("MongoDB Connected Successfully!!!");
  }).catch((error) => {
    console.error("Error connecting MongoDB", error);
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(path.resolve('./assets')));
app.use(express.static(path.resolve('./scripts')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    return res.render('about');
});

app.get('/contact', (req, res) => {
    return res.render('contact');
});

app.get('/menu', (req, res) => {
    return res.render('menu');
});

const Booking = require('./models/Booking');
app.post('/book', async (req, res) => {
  const { date, time, name, phone, num } = req.body;
    if (!date || !time || !name || !phone || !num) {
        return res.status(400).send('Please fill all the fields.');
    }

    try {
        const newBooking = new Booking({
            date,
            time,
            name,
            phone,
            numPeople: num
        });

        await newBooking.save();
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred while booking the table.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});