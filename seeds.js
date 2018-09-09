var mongoose = require("mongoose");
var HolyGround = require("./models/holyground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Futbol Infantil Los Amigos",
        image: "https://bn1ap000files.storage.live.com/y4mox86vty7voqRYcQhqLTnskBh4NV7iMPP5Pw4-AJchtPhRuYWrxJadkDHAkc3lK6YIC2sKOSjo98YU4fF7obqiVPxeXlDOpZHtwoTnolTc2ktCZwp22jy8c_wAewgXsIHpvpclAL-7j5EgiLTOf9-bseKKM5knpV4vzl1rWnv9yiXXj9CjZFdTgKbUxXMy-lB9ZLyWW8dW0Vbi0JCfDWOng/Fila.png?psid=1&width=1325&height=466",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Club Infantil QUILMES JUNIORS",
        image: "https://bn1303files.storage.live.com/y4mM8kbhYmbQt0Oen46UFPW2APdawIlxeThAWmrT-blyuF74FvssXq4Ps3Ko3DuPgBomaelQ4GhrTpuV0PAmRXTADw5CCRlWy-Fun4Nlihr_qUGDTq3xNx-TZ8inNeD0WP8xuruer9FJ4jebu9RJml6d1RBTAzQzB2XYTmo9GJwBqiOILtuK7zTKqmllmYxj-RUWY-E-DcZpAwq2Q8G1wT0iw/QuilmesJuniors.png?psid=1&width=295&height=136",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Futbol Infantil Villa Augusta",
        image: "https://bn1ap000files.storage.live.com/y4m9jMW9ig2hOdz6F1uAykWCyDewchoeyIOu672O1UkNa0ofqCQUIwYmlLcOgemtVR7HGCzOXuGsa3g9-taR_gNry6VDme-8jPhb8JuBpPzCFrAC7SyIU2w4R-0OjmTXo1zx0rYYhVlzHtOAqbxaYLHfxXcHr48DTynkVv6-ULOFIR1Q-p7z-_-HhxrcBDXPNL6d7k0lhZpD2H3rqpls5E5Tg/VillaAugusta.png?psid=1&width=1327&height=469",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
    //Remove all campgrounds
    HolyGround.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed holyground!");
        Comment.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
            //add a few campgrounds
            data.forEach(function(seed){
                HolyGround.create(seed, function(err, holyground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a holyground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    holyground.comments.push(comment);
                                    holyground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    });
    //add a few comments
}

module.exports = seedDB;