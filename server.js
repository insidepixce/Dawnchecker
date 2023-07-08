
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.set("view engine", "ejs");

const MongoClient = require('mongodb').MongoClient;

let db;

const connectToMongoDB = async () => {
  try {
    const client = await MongoClient.connect('mongodb+srv://sparta:test@sparta.rqx1qlk.mongodb.net/?retryWrites=true&w=majority');
    db = client.db('todoapp');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

app.listen(8000, () => {
  console.log('Listening on port 8000');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/write.html'));
});

app.post('/add', async (req, res) => {
  res.send('전송완료');
  try {
    const result = await db.collection("counter").findOne({ name: '게시물갯수' });
    const totalPost = result.totalPost;
    await db.collection('post').insertOne({ 제목: req.body.title, 날짜: req.body.date, check: 'x', _id: totalPost });
    console.log('저장완료');
    await db.collection('counter').updateOne({ name: "게시물갯수" }, { $inc: { totalPost: 1 } });
  } catch (error) {
    console.error('Error while adding post:', error);
  }
});

app.get('/list', async (req, res) => {
  try {
    const result = await db.collection('post').find().toArray();
    res.render('list.ejs', { posts: result });
  } catch (error) {
    console.error('Error while retrieving posts:', error);
  }
});

app.post('/updateCheck/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const checkValue = req.body.check === 'on' ? 'o' : 'x';
    await db.collection('post').updateOne({ _id: parseInt(postId) }, { $set: { check: checkValue } });
    console.log('체크값 업데이트 완료');
    res.redirect('/list');
  } catch (error) {
    console.error('체크값 업데이트 중 오류 발생:', error);
  }
});

connectToMongoDB();
