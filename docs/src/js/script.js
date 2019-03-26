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
console.log(vid);
if(vid !== null)var videoId = vid.dataset.id;
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
//console.log(videoId);
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
//WAVES

var waves = [];
var ans = document.querySelectorAll('.audio-notes li');

$('.posts-audio .audio-wave').each(function(i){
    //console.log('Wave');
    var trackID = $(this).attr('id');
    var src = $(this).data('src');
    var wave = createWave(trackID, src); 

    //wave.on('play', pauseAll(i, waves)); 

    waves.push(wave);
});

$('.audio-post .audio-wave').each(function(i){
    //console.log('Wave');
    var trackID = $(this).attr('id');
    var src = $(this).data('src');
    var wave = createWave(trackID, src); 

    //wave.on('play', pauseAll(i, waves)); 
    wave.on('ready', function () {
        createRegions($('.audio-notes li'), 3, wave);
    });

    wave.on('region-in', function(region) {
        
        console.log("region-in");
        console.log(region);
        
        var rIndex = region.id.slice(3);

        //console.log(rIndex);
        show(ans[rIndex]);
        
        region.once('out', function() {
            console.log("region-out");
            hide(ans[rIndex]);
        });
    });

    
    waves.push(wave);
});

$('.audio-play').each(function(i){
    $(this).click(function(){
        waves[i].playPause();
        //wave[i].on('play', pauseAll(i, waves));
    });
});

function createWave(trackID, src){
    var wave = WaveSurfer.create({
        container: "#"+trackID
    });
    wave.load(src);
    return wave;
}

function createRegions(arr, nLength, ws){
    //Generation de l'array de regions
    for(var i=0; i<arr.length; i++){
        //
        //console.log(arr.eq(i).find('time').html());
        var start = parseFloat(arr.eq(i).find('time').text());
        var end = parseFloat(start+nLength);
        //
        ws.addRegion({
            start: start,
            end: end,
            drag: false,
            resize: false,
            id: 'ws-'+i
        });
    }
}



// GRAB AND INSERT TEXTS FROM .txt FILES


$(document).ready(function() {
    //
    //
    $("p.text-holder").each(function(){
        console.log($(this).parent().data('src'));
        var target = $(this);
        $.ajax({
            url : target.parent().data('src'),
            dataType: "text",
            success : function (data) {
                target.html(data);
            },
            fail: function(xhr, textStatus, errorThrown){
                target.html(textStatus);
             }
        });
    });
}); 


//UTILITIES

var show = function(e){
    if(!e.classList.contains("visible")) e.classList += "visible"; 
}

var hide = function(e){
    if(e.classList.contains("visible")) e.classList.remove("visible"); 
}


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