const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

/**
 * Setup Middleware
 */
app.use(cors());
app.use(express.json());

/**
 * Mongo db setup
 */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ctq5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db('studentsInfo');
        const studentCollection = database.collection('students');

        //? Get Api All Movies
        app.get('/students', async (req, res) => {
            const cursor = studentCollection.find({});

            const movies = await cursor.toArray();


            res.send(movies);
        });
        //? Find One Api
        app.get('/student/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await studentCollection.findOne(query);
            // console.log(result);
            res.json(result);
        });

        //? Post Api Add Student
        app.post('/addStudent', async (req, res) => {
            const student = req.body;
            // console.log(student);
            const result = await studentCollection.insertOne(student);
            res.json(result);
        });

        //? Delete Api
        app.delete('/student/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await studentCollection.deleteOne(query);

            res.json(result);
        });

        //? update Api
        app.patch('/student', async (req, res) => {

            let id = req.body._id;
            // console.log(id);
            const filter = { _id: ObjectId(id) };

            const updateStudent = {
                $set: {
                    studentName: req.body.studentName,
                    group: req.body.group,
                    studentPhoto: req.body.studentPhoto,
                    about: req.body.about,
                },
            };

            const result = await studentCollection.updateOne(filter, updateStudent);
            res.json(result);
        });



    } finally {
        // client.close();
    }
}




app.get('/', (req, res) => {
    res.send('Hello from student!')
});

app.listen(port, () => {
    // console.log(uri);
    console.log(`Student- ${port}`);
});


run().catch(console.dir);