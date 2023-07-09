const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'image'));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpeg');
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use('/image', express.static('public/image'));
app.set("view engine", "ejs");
app.use('/image', express.static(path.join(__dirname, 'public', 'image')));
app.use('/image', express.static(path.join(__dirname, 'public', 'image'), {
  setHeaders: function (res, path, stat) {
    res.set('Cache-Control', 'public, max-age=31536000'); // 1 year
  }
}));


const url = 'mongodb+srv://sparta:test@sparta.rqx1qlk.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'todoapp';
let postCollection;
let counterCollection;
let gongCollection;

const connectToMongoDB = async () => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    postCollection = db.collection('post');
    counterCollection = db.collection('counter');
    gongCollection = db.collection('gong');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};

connectToMongoDB(); // MongoDB에 연결

app.listen(3000, '0.0.0.0', () => {
  console.log('Listening on port 8000');
});

app.get('/main', async (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'main.html'));
});

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'write.html'));
});

app.post('/add', async (req, res) => {
  try {
    const result = await counterCollection.findOne({ name: '게시물갯수' });
    const totalPost = result.totalPost;
    await postCollection.insertOne({ 제목: req.body.title, 날짜: req.body.date, check: 'x'});
    console.log('저장완료');
    await counterCollection.updateOne({ name: "게시물갯수" }, { $inc: { totalPost: 1 } });
    const postresult = await postCollection.find().toArray();
    res.render('list.ejs', { posts: postresult });
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

app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const post = {
      filename: req.file.filename,
      content: req.body.content,
      currentTime: req.body.currentTime
    };
    
    await gongCollection.insertOne(post);
    console.log('저장완료');
    res.send('전송완료');
  } catch (error) {
    console.error('Error while uploading post:', error);
    res.status(500).send('업로드에 실패하였습니다.');
  }
});






app.get('/gong', async (req, res) => {
  try {
    const posts = await gongCollection.find().toArray();
    res.render('gong.ejs', { posts: posts });
  } catch (error) {
    console.error('Error while retrieving gong posts:', error);
    res.status(500).send('게시물을 가져오는데 실패하였습니다.');
  }
});

app.post('/updateCheck/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const checkValue = req.body.check === 'on' ? 'o' : 'x';
    await postCollection.updateOne({ _id:  new ObjectId(postId) }, { $set: { check: checkValue } });
    console.log('체크값 업데이트 완료');
    res.redirect('/list');
  } catch (error) {
    console.error('체크값 업데이트 중 오류 발생:', error);
    res.status(500).send('체크값 업데이트에 실패하였습니다.');
  }
});


app.delete('/delete/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    await postCollection.deleteOne({ _id: new ObjectId(postId) });
    console.log('게시물 삭제 완료');
    res.sendStatus(200);
  } catch (error) {
    console.error('게시물 삭제 중 오류 발생:', error);
    res.sendStatus(500);
  }
});





app.delete('/gong/delete/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    await gongCollection.deleteOne({ _id: new ObjectId(postId) });
    console.log('데이터 삭제 완료');
    res.sendStatus(200);
  } catch (error) {
    console.error('데이터 삭제 중 오류 발생:', error);
    res.sendStatus(500);
  }
});


