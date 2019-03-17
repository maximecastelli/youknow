console.log('main.js has been load');

//Store Mode text video audio
if(!localStorage.getItem('mode')){
    localStorage.setItem('mode', "video");
}


//alert(localStorage.getItem('mode'));

function setMode(mode){
    localStorage.setItem('mode', mode);
    //alert(localStorage.getItem('mode'));
    document.body.classList = "";
    document.body.classList += localStorage.getItem('mode');
    setActive();
}

var clickMode = function(e){

    var m = e.dataset.mode;
    console.log(m);
    setMode(m); 
}

document.body.classList += localStorage.getItem('mode');
setActive();

 function setActive(){
    $('a.nav-link').each(function(){
        if($(this).data('mode') == localStorage.getItem('mode')){
            $(this).addClass('active');
        }else{
            $(this).removeClass('active');
        }
    });
}


// VIDEO PLAYER FUNCTIONS

// IFrame Player API async
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Grab Video ID

var vid = document.getElementById('player');
var videoId = vid.dataset.id;
var videotime = 0;
var timeupdater = null;
var vindex = 0;

var vts = Array.prototype.slice.call(document.querySelectorAll('.video-notes time'));
var vns = document.querySelectorAll('.video-notes li');

for (var i=0; i<vts.length; i++){
    vts[i]= vts[i].innerHTML;
}
console.log(vts);
//

// Create player
var player;
function onYouTubeIframeAPIReady() {
console.log(videoId);
player = new YT.Player('player', {
    height: '850',
    width: '1280',
    videoId: videoId,
    events: {
    'onReady': onPlayerReady,
    'onStateChange': onPlayerStateChange
    }
});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
//event.target.playVideo();
    
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        //setTimeout(stopVideo, 6000);
        console.log('Video play');
        //done = true;
        function updateTime() {
            var oldTime = videotime;
            if(player && player.getCurrentTime) {
            videotime = player.getCurrentTime();
            }
            if(videotime !== oldTime) {
            onProgress(videotime);
            }
        }
        timeupdater = setInterval(updateTime, 250);
    }
}

function stopVideo() {
player.stopVideo();
}

// when the time changes, this will be called.
function onProgress(currentTime) {
    //console.log("running - " + currentTime);
    for(var i=vindex; i<vts.length; i++){
        console.log('------------');
        if(vts[i]< currentTime + 0.33 && vts[i]> currentTime - 0.33){
            //alert("note "+i+" should appear");
            //
            var n = vns[i];
            //console.log(ns);
            console.log(n);
            show(n);
            vindex = i+1;
        }
    }
}

//Audio API

// Get Audio Element
const audio = document.querySelector('audio');

// Get notes and timestamps
var ats = Array.prototype.slice.call(document.querySelectorAll('.audio-notes time'));
var ans = document.querySelectorAll('.audio-notes li');
//
for (var i=0; i<ats.length; i++){
    ats[i]= ats[i].innerHTML;
}
console.log(ats);

audio.addEventListener('play', (event) => {
    console.log('audio starts');
});


audio.addEventListener('playing', (event) => {
  console.log('audio is not longer paused');
});
/*
audio.onprogress = function(){
  console.log("progress " + audio.currentTime);  
};
*/

var aindex = 0;


audio.ontimeupdate = function(){
    console.log("timeUpdate " + audio.currentTime); 
    var ct = audio.currentTime;
    
    for(var i=aindex; i<ats.length; i++){
        console.log('------------');
        if(ats[i]< ct + 0.33 && ats[i]> ct - 0.33){
            //alert("note "+i+" should appear");
            //
            var n = ans[i];
            //console.log(ns);
            console.log(n);
            show(n);
            aindex = i+1;
        }
    }
};

var show = function(e){
    e.classList += "visible"; 
}



//UTILITIES

function hasClass(ele,cls) {
    //return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
    console.log(ele.classList.contains(cls));
    return ele.classList.contains(cls);
  }
  
  function addClass(ele,cls) {
    if (!hasClass(ele,cls)) ele.classList += cls;
  }
  
  function removeClass(ele,cls) {
    if (hasClass(ele,cls)) {
      //var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      ele.classList -= cls;
    }
  }
  
// ON LAISSE TOMBER SOUNDCLOUD TROP DE COMPLICATIONS POUR QUE DALLE
// recuperation des infos SC


//var url = "https://cors-anywhere.herokuapp.com/https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/409954680";
/*
var url = "https://cors-anywhere.herokuapp.com/https://soundcloud.com/feelmybicep/bicep-opal-four-tet-remix";

var request = new XMLHttpRequest();



request.open('GET', url, true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    console.log('success');
    //var data = JSON.parse(request.responseText);
    var parser = new DOMParser();
    var doc = parser.parseFromString(request.responseText, "text/html");
    //console.log(doc.querySelector("div.commentsList").innerHTML);
    console.log(request.responseText);

  } else {
    // We reached our target server, but it returned an error
    console.log('nup:'+ request.status);

  }
};

request.onerror = function() {
  // There was a connection error of some sort
  console.log('supernup');
};

request.send();
*/