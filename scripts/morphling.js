"use strict";
var LineMessaging = require('hubot-line-messaging-api');
var StickerMessage = require('hubot-line-messaging-api').StickerMessage;
var PostbackMessage = require('hubot-line-messaging-api').PostbackMessage;
var SendSticker = LineMessaging.SendSticker;
var SendLocation = LineMessaging.SendLocation;
var SendImage = LineMessaging.SendImage;
var SendVideo = LineMessaging.SendVideo;
var SendAudio = LineMessaging.SendAudio;
var SendText = LineMessaging.SendText;

// 3rd party libs
var imgur = require('imgur');
var Promise = require("bluebird");

var sendImageString = "";

function uploadImages (res, respBody) {
  console.log('uploadImages---1');
  for(var index in respBody){
    var imgUrl = respBody[index].images;
    if(index >= 0 && index <= 4)
    imgur.uploadUrl(imgUrl)
        .then(function (json) {
            var imgurUrl = json.data.link;
            imgurUrl = imgurUrl.replace(/^http:\/\//i, 'https://');
            // image.push(new SendImage(imgurUrl, imgurUrl));
            // sendImageString = sendImageString + ", new SendImage('" + imgurUrl + "', '" + imgurUrl + "')";
            res.reply(new SendImage(imgurUrl, imgurUrl));
            console.log("?????", imgurUrl);
        })
        .catch(function (err) {
            console.error(err.message);
        });
  }
}

function pushImageByLine (res) {
  console.log('pushImageByLine---2');
  // eval("res.reply(sendImageString);");
}

const BuildTemplateMessage = LineMessaging.BuildTemplateMessage;

const LINE_TOKEN = process.env.HUBOT_LINE_TOKEN;

module.exports = function(robot){
  var filterStickers = function(message){
    var result = false;
    var stickerMsg = message.message;
    if (stickerMsg && stickerMsg.type && stickerMsg.type === 'sticker'){
      result = true;
    }
    // Not implement listener, so should CatchAllMessage.message
    //console.log("message: ", message);
    var user = message.user;
    robot.brain.set('USER:' + user.id, user);
    return result;
  };

  var filterPostback = function(message){
    var result = false;
    var postbackMsg = message.message;
    if (postbackMsg && postbackMsg.type && postbackMsg.type === 'postback'){
      result = true;
      
      // TODO save to database
    }
    console.log('filterPostback', result);
    return result;
  }

  robot.listen(filterPostback, function(res){
    console.log('reply postback');
    // push API

    var text = new SendText('已訂閱完成，謝謝');
    res.reply(text);
  });

  robot.listen(filterStickers, function(res){
    var stickerMessage = res.message.message;
    // This line is necessary to prevent error
    res.envelope.message = stickerMessage;
    var sticker = new SendSticker(stickerMessage.stickerId, stickerMessage.packageId);
    res.reply(sticker);
  });

  robot.respond(/hello/i, function(res){
    res.reply('world');
  });

  robot.hear(/profile/i, function(res){
    console.log("HUBOT_LINE_TOKEN ", LINE_TOKEN);
    console.log("USERID " , res.message.user.id);
    robot.http("https://api.line.me/v2/bot/profile/" + res.message.user.id)
      .header('Authorization', "Bearer " + LINE_TOKEN)
      .get()(function(err, resp, body) {
        console.log('RESP ', resp);
        console.log('BODY ', body);
        var respBody = JSON.parse(body);
        res.reply('你好，' + respBody.displayName + "，使用者ID " + res.message.user.id);
      });
  });

  robot.hear(/help/i, function(res){
    var text1 = new SendText('輸入 [subscribe]，即可享受訂閱推播服務');
    var text2 = new SendText('輸入 [list]，即可顯示Top 3推薦漫畫');
    var text3 = new SendText('輸入 [profile]，顯示個人資訊');

    res.reply(text1, text2, text3);
  });

  robot.hear(/buttons/i, function(res){
    var msg = BuildTemplateMessage
      .init('this is a template msg')
      .buttons({
        thumbnailImageUrl: 'https://github.com/puresmash/chatting-robot/blob/develope/docs/template.jpg?raw=true',
        title: 'Template Message',
        text: 'Let me google for you'
      })
      .action('uri', {
        label: 'Open Google',
        uri: 'https://www.google.com.tw/'
      })
      .action('uri', {
        label: 'Adapter Link',
        uri: 'https://www.google.com.tw/'
      })
      .build();
    res.reply(msg);
  });

  /**
   * Image URL (Max: 1000 characters)
   * HTTPS
   * JPEG or PNG
   * Aspect ratio: 1:1.51
   * Max width: 1024px
   * Max: 1 MB
   *
   * 訂閱後收到 postback 這邊可以提供付費功能
   */
  robot.hear(/list/i, function(res){
    var msg = BuildTemplateMessage
      .init('Comic list')
      .carousel({
        thumbnailImageUrl: 'https://static.fzdm.com/manhua/img/2.jpg',
        title: '海賊王',
        text: '海賊王852話'
      })
      .action('uri', {
        label: '線上觀看',
        uri: 'http://140.110.203.1/test_comicr/api/pageGet.php?title=%E6%B5%B7%E8%B3%8A%E7%8E%8B%E6%BC%AB%E7%95%AB&vol=2&comicLink=852'
      })
      .action('postback', {
        label: '訂閱[海賊王]',
        data: 'subscribe=true&comic=2'
      })
      .carousel({
        thumbnailImageUrl: 'https://static.fzdm.com/manhua/img/10.jpg',
        title: '獵人',
        text: '獵人360話'
      })
      .action('uri', {
        label: '線上觀看',
        uri: 'http://140.110.203.1/test_comicr/api/pageGet.php?title=%E7%8D%B5%E4%BA%BA%E6%BC%AB%E7%95%AB&vol=10&comicLink=360'
      })
      .action('postback', {
        label: '訂閱[獵人]',
        data: 'subscribe=true&comic=10'
      })
      .carousel({
        thumbnailImageUrl: 'https://static.fzdm.com/manhua/img/1.jpg',
        title: '火影忍者',
        text: '火影忍者博人傳08話'
      })
      .action('uri', {
        label: '線上觀看',
        uri: 'http://140.110.203.1/test_comicr/api/pageGet.php?title=%E7%81%AB%E5%BD%B1%E5%BF%8D%E8%80%85%E6%BC%AB%E7%95%AB&vol=1&comicLink=brz08'
      })
      .action('postback', {
        label: '訂閱[火影忍者]',
        data: 'subscribe=true&comic=1'
      })
      .build();
    res.reply(msg);
  });

  robot.hear(/show (.*) (.*)/i, function(res){
    // var imgae = SendImage();
    var comic = res.match[1];
    var vol = res.match[2];
    sendImageString = "";
    // Fetch from comicr node service api
    robot.http("https://mighty-spire-72176.herokuapp.com/api/" + comic + "/" + vol)
      .get()(function(err, resp, body) {
        var respBody = JSON.parse(body);
        // var image = [];
        var promiseArray= [];
        promiseArray.push(new Promise(function(resolve) {
          resolve(uploadImages(res, respBody));
        }));
        // promiseArray.push(new Promise(function(resolve) {
        //   resolve(pushImageByLine(res));
        // }));
        Promise.each(promiseArray, function() {
          console.log("promise works!");
        });

        // Promise.each(
        //   uploadImages(respBody)
        //   ).then(function(){
        //     eval("res.reply(sendImageString);");
        //     console.log("#######", sendImageString);
        //   })
        // .catch(function(err) {
        //     res.status(500).send(err);
        //   });
      });

  });

  robot.hear(/subscribe/i, function(res){
    var msg = BuildTemplateMessage
      .init('Subscribe')
      .confirm({
        text: '訂閱海賊王?'
      })
      .action('postback', {
        label: '訂閱',
        //data: 'subscribe=true&comic=02'
        text: '訂閱成功'
        //uri: 'https://www.google.com.tw/search?q=ok'
      })
      .action('message', {
        label: '取消',
        text: '太可惜了'
      })
      .build();
    res.reply(msg);
  });
};
