const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.set("view engine", "ejs");

let db;
let postCollection;
let counterCollection;

const connectToMongoDB = async () => {
  try {
    const client = await MongoClient.connect('mongodb+srv://sparta:test@sparta.rqx1qlk.mongodb.net/?retryWrites=true&w=majority');
    db = client.db('todoapp');
    postCollection = db.collection('post');
    counterCollection = db.collection('counter');
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
  try {
    const result = await counterCollection.findOne({ name: '게시물갯수' });
    const totalPost = result.totalPost;
    await postCollection.insertOne({ 제목: req.body.title, 날짜: req.body.date, check: 'x', _id: totalPost });
    console.log('저장완료');
    await counterCollection.updateOne({ name: "게시물갯수" }, { $inc: { totalPost: 1 } });
    res.send('전송완료');
  } catch (error) {
    console.error('Error while adding post:', error);
    res.status(500).send('전송에 실패하였습니다.');
  }
});

app.get('/list', async (req, res) => {
  try {
    const result = await postCollection.find().toArray();
    res.render('list.ejs', { posts: result });
  } catch (error) {
    console.error('Error while retrieving posts:', error);
    res.status(500).send('게시물을 가져오는데 실패하였습니다.');
  }
});

app.post('/updateCheck/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const checkValue = req.body.check === 'on' ? 'o' : 'x';
    await postCollection.updateOne({ _id: parseInt(postId) }, { $set: { check: checkValue } });
    console.log('체크값 업데이트 완료');
    res.redirect('/list');
  } catch (error) {
    console.error('체크값 업데이트 중 오류 발생:', error);
    res.status(500).send('체크값 업데이트에 실패하였습니다.');
  }
});

connectToMongoDB();
