const express = require('express');
const multer = require('multer');
const app = express();
const mongoose = require("mongoose");
const Photos = require("./models/photo-model");
const methodOverride = require('method-override');
const path = require("path");

//連結mongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/multerDB")
  .then(() => {
    console.log("正在連結到mongoDB...");
  })
  .catch((e) => {
    console.log(e);
  });

//設定Middlewares以及排版引擎
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads")); //uploads目錄為靜態網址
app.use(methodOverride("_method"));

// Multer設定
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 存放上傳檔案的資料夾路徑
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).array('photos');
app.get("/",async(req,res)=>{
    let uploadedPhotos = await Photos.find({}).exec();
    return res.render("homepage",{uploadedPhotos});
})

app.post('/upload', async(req, res) => {
  upload(req, res, (err) => {
    if (err) {
      // 處理錯誤
      return res.status(400).send('上傳失敗');
    }
    // 處理成功後，回傳上傳成功訊息或其他操作
    let {title} = req.body;
    // 解析 JSON 字串成物件
    //const photoArray = req.body.photos ? JSON.parse(req.body.photos) : [];   
    const photoArray = req.files? req.files.map(file => ({ imageUrl: file.filename, alt:file.originalname })) : [];
    let newData = new Photos({
        title,
        photos:photoArray,
    });    
    newData.save(); 
    return res.redirect("/");    
  });
});

app.listen(5050, () => {
  console.log('伺服器運行在port5050');
});
