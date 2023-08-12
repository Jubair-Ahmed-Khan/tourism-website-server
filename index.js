const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.DATABASE;
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
        const orderCollection = database.collection('orders');

        //GET API

        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
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

        app.get('/bookings', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })
        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = orderCollection.find(query);
            const order = await cursor.toArray();
            res.send(order);
        })

        //POST API

        app.post('/packages', async (req, res) => {
            const newPackage = req.body;
            const result = await packagesCollection.insertOne(newPackage);
            res.json(result);
        })

        app.post('/bookings', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
        })

        //UPDATE API

        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: false };
            const updateDoc = {
                $set: {
                    status: data.status
                }
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        //DELETE API

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
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
    console.log('port === ', port);
})