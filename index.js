const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ryj5i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());
async function run() {
    try {
        await client.connect();
        const database = client.db("travel-guru");
        const packagesCollection = database.collection("packages");
        const destinationCollection = database.collection("destination");
        const specialityCollection = database.collection("speciality");

        //GET API

        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        app.post('/packages', async (req, res) => {
            const newPackage = req.body;
            // console.log('hitting the post', newPackage);
            const result = await packagesCollection.insertOne(newPackage);
            // console.log(result);
            res.json(result);

            // const filter = { id: newPackage.id };
            // console.log('new data : ', filter);
            // const cursor = packagesCollection.find(filter);
            // const package = await cursor.toArray();
            // console.log(service);
            // if already have a service with this id, then no entry in DB
            // if (package.length) {
            //     res.send('already have this id');
            // }
            // else {
            //     const result = await packagesCollection.insertOne(newPackage);
            //     console.log(`Added user at index: ${result.insertedId}`);
            //     console.log('Success', result);
            //     res.json(result);
            // }
        })
        app.get('/destination', async (req, res) => {
            const cursor = destinationCollection.find({});
            const destinations = await cursor.toArray();
            res.send(destinations);
        })
        app.get('/speciality', async (req, res) => {
            const cursor = specialityCollection.find({});
            const specialities = await cursor.toArray();
            res.send(specialities);
        })

    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my crud server');
});

app.listen(port, () => {
    console.log('Runnning server on port ', port);
})