import fetch from "node-fetch";
import express from "express";
import https from "https";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose"
const __dirname = path.resolve();



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://omkar:OMKAR@cluster0.duiwp6o.mongodb.net/YotubeAPI", {
  useNewUrlParser: true
});


//mongoose Schema
const YotubevideoSchema = mongoose.Schema({
  videoid: {
    type: String,
    unique: true,
    required: true
  },
  publishedate: {
    type: String,

  },
  channelid: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  thumbnails: {
    type: String,
  },
  channelTitle: {
    type: String,
  }
});

const Yotubevideo = mongoose.model("Yotubevideo", YotubevideoSchema);

//Initialized Global Variables For computation
var apiKey = "AIzaSyCi39MlsWy6Dfrn9MbsIap5FbcEmP3QvUc";
var list = [];
var required_list = [];
var count = 0;
var databaselist = [];
var finalarray = [];
var storedata = [];

//First Get request which will render a data
app.get("/", function(req, res) {

  // history.go(0);
  if (count == 0 && count > 1) {
    count = 0;
    list = [];
    required_list = [];
    list.length = 0;

  };
  console.log(required_list);
  console.log(list);
  // console.log(list);
  res.render('omkar', {
    KindOfDays: required_list
  });
});



//Dashboard Route to see Stored videos
app.get("/dashboard", function(req, res) {

  const users = Yotubevideo.find({}).distinct('videoid')
    .then(data => {


      for (var i = 0; i < data.length; i++) {
        var dataurl = "http://www.youtube.com/embed/" + data[i];
        console.log(dataurl);
        databaselist.push(dataurl);
        console.log(databaselist.length);
        console.log(data[i]);
      }

      res.render('dashboardresult', {
        EachUSers: databaselist
      });
      databaselist = [];;

    });

});



//For searching video  from Stored videos via description/title
app.get("/findresult", function(req, res) {

  res.render('searchresult', {
    EachUSers: storedata
  });
  // storedata=[];

});


//Post request for Rendering data depends on User's Search request and Pagentation
app.post("/", function(req, res) {

  var pageNo = req.body.Pagentation;
  console.log(pageNo);
  var maxVideos = req.body.maxvideos;
  console.log(maxVideos);


  var startIndex = (maxVideos * pageNo) - maxVideos;
  var endIndex = maxVideos * pageNo;

  count = count + 1;
  const maxResults = 40;
  const searchQuery = req.body.search;
  // const apiKey = "AIzaSyCi39MlsWy6Dfrn9MbsIap5FbcEmP3QvUc";
  const url = "https://youtube.googleapis.com/youtube/v3/search?key=" + apiKey + "&type=video&part=snippet&maxResults=" + maxResults + "&q=" + searchQuery + "&order=date";



  list = [];
  required_list = [];

  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {

      //If ApI exceed it's limit it will take second key as a API key
      if (data.length == 0) {
        apiKey = "AIzaSyA1lgTYxtsXAJDIIr3GX3MsM9bbwd507Nk";
        res.render("/");
      }

      data.items.forEach(item => {

        let video = "http://www.youtube.com/embed/" + item.id.videoId;
        list.push(video);

        var check = item.id.videoId;

        const newvideo = new Yotubevideo({
          videoid: item.id.videoId,
          publishedate: item.snippet.publishedAt,
          channelid: item.snippet.channelId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnails: item.snippet.thumbnails.default.url,
          channelTitle: item.snippet.channelTitle
        });



        ///Some Error Handelling code
        //commented code implies alternative for particular block

         newvideo.save();


        // Yotubevideo.findOne({videoid: item.id.videoId})
        //    .then(resp=>{
        //      if(resp.length==0){
        //        var dataurl2="http://www.youtube.com/embed/" +item.id.videoId;
        //        console.log(dataurl2);
        //        databaselist.push(dataurl2);
        //      }
        //      })


        Yotubevideo.findOne({
            videoid: item.id.videoId
          })
          .then(resp => {

            if (resp.length != 0) {
              console.log("data Exists");
            } else {

              newvideo.save();

            }
          }).catch(err => {
            console.log(err);
          })

      });

      required_list = list.slice(startIndex, endIndex);


      res.redirect("/");
    });


});

//Finderesult post route which will deliver result of search video which is presented in our database
app.post("/findresult", function(req, res, next) {
  var result = req.body.search;
  console.log(result);

  var Searchvia = req.body.searchvia;
  console.log(Searchvia);

  if (Searchvia == "title") {

    Yotubevideo.findOne({
      title: result
    }, function(err, founduser) {
      if (founduser == null) {
        // res.redirct("/findresult");

        res.send("<center><h2>Video Does not exist in database <h2>");
        // res.redirct("/findresult");

      }


      var Videoid = founduser.videoid;
      var video = "http://www.youtube.com/embed/" + Videoid;

      res.send("<center><h3>Search result for " + result + ":</h3></center></br></br></br><center><iframe   allowfullscreen width=400 height=400 src=" + video + "></iframe></center>");
    });
  }

  if (Searchvia == "description") {

    Yotubevideo.findOne({
      description: result
    }, function(err, founduser) {
      if (founduser == null) {


        res.send("<center><h2>Video Does not exist in database <h2><center>");

      }


      var Videoid = founduser.videoid;
      var video = "http://www.youtube.com/embed/" + Videoid;

      res.send("<center><h3>Search result for " + result + ":</h3></center></br></br></br><center><iframe   allowfullscreen width=400 height=400 src=" + video + "></iframe></center>");
    });
  }


});



//Server has started on port 5000
app.listen(5000, function(req, res) {
  console.log("Server has started on port 5000");
});
