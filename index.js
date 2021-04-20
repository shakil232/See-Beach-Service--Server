const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const Object = require('mongodb').ObjectID
require('dotenv').config();
const port = process.env.PORT || 5100;

// process.env.DB_USER

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9cu5v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const { ObjectID } = require('mongodb');
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello World!')
});

client.connect(err => {
    const AddServiceCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
    const ReviewCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTIONREVIEW}`);
    const GalleryCollection = client.db('seaRide').collection('addGallery');
    const AdminCollection = client.db('seaRide').collection('addAdmin');
    const BookingCollection = client.db('seaRide').collection('addBooking');

    // ServicesArea
    // ServiceCollection
    app.get('/allServices', (req, res) => {
        AddServiceCollection.find()
            .toArray((err, service) => {
                res.send(service)
            })
    });

    //  AddServices
    app.post('/addService', (req, res) => {
        const NewService = req.body;
        AddServiceCollection.insertOne(NewService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // BookedService
    app.get('/bookedService/:id', (req, res) => {
        const Id = ObjectID(req.params.id);
        AddServiceCollection.find({ _id: Id })
            .toArray((err, product) => {
                res.send(product[0]);
            })
    });

    // ManageServices
    app.get('/manageService', (req, res) => {
        AddServiceCollection.find()
            .toArray((err, documents) => {
                res.send(documents)
            })
    });


    // DeleteServices
    app.delete('/deleteService/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        AddServiceCollection.findOneAndDelete({ _id: id })
            .then(result => {
                res.send(result.deleteCount > 0)
            })
    });


    //  BookingAREA
    // BookedRide
    app.post('/bookedRide', (req, res) => {
        const addRideBooked = req.body;
        BookingCollection.insertOne(addRideBooked)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/bookedList', (req, res) => {
        BookingCollection.find()
            .toArray((err, documents) => {
                res.send(documents)
            })
    });

    app.get('/bookingByEmail', (req, res) => {
        BookingCollection.find({ email: req.query.email })
            .toArray((error, documents) => {
                res.send(documents)
            })
    });


    // ReviewArea
    //  reviewCollection
    app.get('/reviewDisplay', (req, res) => {
        ReviewCollection.find()
            .toArray((err, service) => {
                res.send(service)
            })
    });

    //  AddReviews
    app.post('/addReview', (req, res) => {
        const NewReview = req.body;
        ReviewCollection.insertOne(NewReview)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });


    // GalleryArea
    // GalleryCollection
    app.get('/allGallery', (req, res) => {
        GalleryCollection.find()
            .toArray((err, image) => {
                res.send(image)
            })
    });

    //  AddGallery
    app.post('/addGallery', (req, res) => {
        const NewImageAdd = req.body;
        GalleryCollection.insertOne(NewImageAdd)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
 
    //  AdminArea
    // AddAdmin
    app.post('/addAdmin', (req, res) => {
        const NewAdmin = req.body;
        AdminCollection.insertOne(NewAdmin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    //conditional rendering Admin
    // app.post("/isAdmin", (req, res) => {
    //     const email = req.body.email;
    //     AdminCollection.find({ email: email })
    //     .toArray((err, documents) => {
    //         res.send(documents.length > 0);
    //     });
    // });

});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})