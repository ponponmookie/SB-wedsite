const express = require('express')
const cors = require('cors')
const { ObjectId } = require('mongodb')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World! Let\'s Working with NoSQL Databases')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const { MongoClient } = require("mongodb");
const uri = "mongodb://mutita:3669@localhost:27017/?authMechanism=DEFAULT&authSource=Miniproject";
const connectDB = async() => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log(`MongoDB connected successfully.`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}
connectDB();

// Read All API
app.get('/Shopping', async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('Miniproject').collection('Shopping').find({}).sort({ "Customer ID": -1 }).limit(50).toArray();
    await client.close();
    res.status(200).send(objects);
})
// Read Users collection
app.get('/Users', async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('Miniproject').collection('Userrr').find({}).toArray();
    await client.close();
    res.status(200).send(objects);
})

// Read Category collection
app.get('/Category', async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('Miniproject').collection('Category').find({}).toArray();
    await client.close();
    res.status(200).send(objects);
})


// // Create API
app.post('/Shopping/create', async(req, res) => {
    const object = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('Miniproject').collection('Shopping').insertOne({
        'Customer ID': object['Customer ID'],
        Age: object.Age,
        Gender: object.Gender,
        'Item Purchased': object['Item Purchased'],
        Category: object.Category,
        'Purchase Amount (USD)': object['Purchase Amount (USD)'],
        'Shipping Type': object['Shipping Type'],
        'Discount Applied': object['Discount Applied'],
    });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Shopping Behavior is created",
        "Shopping": object
    });
})

// // Update API
app.put('/Shopping/update/', async(req, res) => {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('Miniproject').collection('Shopping').updateOne({ '_id': new ObjectId(id) }, {
        "$set": {
            "_id": new ObjectId(id),
            'Customer ID': object['Customer ID'],
            Age: object.Age,
            Gender: object.Gender,
            'Item Purchased': object['Item Purchased'],
            Category: object.Category,
            'Purchase Amount (USD)': object['Purchase Amount (USD)'],
            'Shipping Type': object['Shipping Type'],
            'Discount Applied': object['Discount Applied'],
        }
    });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "message": "Shopping record with ID = " + id + " is updated",
        "Shopping": object
    });
})

// // Delete API
app.delete('/Shopping/delete', async(req, res) => {
    const object = req.body;
    const id = object._id;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('Miniproject').collection('Shopping').deleteOne({ '_id': new ObjectId(id) });
    await client.close();
    res.status(200).send({ // ถามอาจารย์ขึ้นตรงไหน!!
        "status": "ok",
        "ID": id,
        "message": "Shopping record with ID = " + id + " is deleted"
    });
})


// // Read Limit API
app.get('/Shopping/limit', async(req, res) => {
    const client = new MongoClient(uri);
    await client.connect(); // wait for the connection to be established before moving on to the next steps.
    const objects = await client.db('Miniproject').collection('Shopping').find({}).sort({ "Customer ID": -1 }).limit(3900).toArray();
    // อ่านข้อมูล Limit ที่ 10,000 records
    await client.close(); // closes the MongoDB connection 
    res.status(200).send(objects);
})

// // Read by id API
app.get('/Shopping/:id', async(req, res) => {
    const { params } = req;
    const id = params.id
    const client = new MongoClient(uri);
    await client.connect();
    const object = await client.db('Miniproject').collection('Shopping').findOne({ "_id": new ObjectId(id) });
    await client.close();
    res.status(200).send({
        "status": "ok",
        "ID": id,
        "object": object
    });
})

// // Query by filter API: Search text from Product Name
app.get('/Shopping/shipping_type/:searchText', async(req, res) => {
    const { params } = req;
    const searchText = params.searchText
    const client = new MongoClient(uri);
    await client.connect();
    const objects = await client.db('Miniproject').collection('Shopping').find({ $text: { $search: searchText } }).sort({ "Customer ID": -1 }).limit(50).toArray();
    // ดึงข้อมูลมา 15 records
    await client.close();
    res.status(200).send({ // The HTTP status code 200 is a standard response for successful HTTP requests
        "status": "ok",
        "searchText": searchText,
        "Shopping": objects // ***** ระวังบรรทัดนี้ไม่งั้นจะคิวรี่ไม่เจอนะ ****
    });
})

app.post('/Users/login', async (req, res) => {
    const params = req.body;
    const username = params.user;
    const password = params.pass;
    const client = new MongoClient(uri);
    try {
        const user = await client.db('Miniproject').collection('Userrr').findOne({ Username: username, Password: password });
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (err) {
        console.log('database connection error!, ', err);
        res.status(500).send('Database error');
    }
});
