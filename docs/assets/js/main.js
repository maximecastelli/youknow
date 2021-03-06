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
    //setActive();
    
}

var clickMode = function(e){

    var m = e.dataset.mode;
    //console.log(m);
    setMode(m); 
    stopAll();
}

document.body.classList += localStorage.getItem('mode');
    

// IFrame Player API async
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Grab Video ID
var vid = document.getElementById('player');
console.log(vid);
if(vid !== null){
    var videoId = vid.dataset.id;

    var vWidth = document.getElementById('player').offsetWidth;
    var vHeight = Math.round((vWidth / 16)*9);

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
}
// Create player
var player;
function onYouTubeIframeAPIReady() {
//console.log(videoId);
player = new YT.Player('player', {
    height: vHeight,
    width: vWidth,
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
    //console.log(event.target);
    //console.log(event.target.getVideoData());
    //console.log(videoId);
    getViews(videoId, $('.visits span'));
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



if (window.matchMedia("(min-width: 1024px)").matches) {
    /* La largeur minimum de l'affichage est 768 px inclus */
    $('.posts-audio .audio-wave').each(function(i){
        //console.log('Wave');
        var trackID = $(this).attr('id');
        var src = $(this).data('src');
        var wave = createWave(trackID, src); 
        var current =  $(this);
    
        wave.on('loading', function(e) {
    
            current.css('background-size', e + '% 100%');
        });
        wave.on('ready', function () {
            current.css('background-position-x', 100+'%');
            current.css('background-size', '0% 100%');
        });
    
        waves.push(wave);
    });
  } else {
    /* L'affichage est inférieur à 768 de large */
  }


$('.audio-post .audio-wave').each(function(i){
    //console.log('Wave');
    var trackID = $(this).attr('id');
    var src = $(this).data('src');
    var wave = createWave(trackID, src); 
    var current =  $(this);
    
    wave.on('loading', function(e) {
        console.log( this.classList+ ' - ' + e);
        current.css('background-size', e + '% 100%');
    });
    //wave.on('play', pauseAll(i, waves)); 
    wave.on('ready', function () {
        createRegions($('.audio-notes li'), 300, wave);
        current.css('background-position-x', 100+'%');
        current.css('background-size', '0% 100%');
        //console.log('Region');
    });

    wave.on('region-in', function(region) {
        
        //console.log("region-in");
        //console.log(region);
        
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

$('.audio-play i').each(function(i){
    $(this).click(function(){
        waves[i].playPause();
        $(this).toggleClass('playing');
        if($(this).hasClass('playing'))$(this).html('pause');
        else $(this).html('play_arrow');
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
var nbuffer = [];

$(document).ready(function() {
    //
    //
    //SEPARATOR 
    $(".posts-text > .active").last().after('<span class="post-separator"></span>');
    
    //
    $("p.text-holder").each(function(){
        console.log($(this).parent().data('src'));
        var target = $(this);
        $.ajax({
            url : target.parent().data('src'),
            dataType: "text",
            success : function (data) {
                target.html(data);
                
                $('.text-note').each(function(){
                    $(this).append('<span class="note-switch"> ['+ $(this).data('note') +'] </span>')
                });

            },
            fail: function(xhr, textStatus, errorThrown){
                target.html(textStatus);
             }
        });
        
    });
    

    $(".note-content").each(function(e){
        var c = $(this).html();
        var url = c.split('http');
        if(url.length<2) return;
        url = url[1].split(' ');
        var u = 'http' + url[0];
        // wrap it now
        var oc = c.split(u);
        var nc =  oc[0];
            nc += '<a href="'+u+'" target="_blank" class="note-link">'+ u+'</a>';
            nc += '<p>' + oc[1]+ '</p>';
        
        $(this).html(nc);

        console.log('link wrapped'); 

    });

    $(document).on('click','.note-switch',function(e){
    
        var target = $('li[data-note = ' + $(this).parent().data('note') + ']')[0];
        
        
        console.log(target);
        //console.log(nbuffer);
        if(!target.classList.contains('visible')){
            show(target);
            $(target).attr('data-i', nbuffer.length+1);
            nbuffer.push(target);
            console.log('push : '+nbuffer);
        }
        else {
            hide(target);
            nbuffer.splice($(target).data('i')-1,1);
            console.log('splice : '+ nbuffer);
            $(target).data('i', 0);

        }
        reorder('.note-list');
    });

    // grab all yt video and set visit counter
    $('.posts-video > .post.active').each(function(){
        var cv = $(this).data('video');
        getViews( cv , $(this).find('.visits span'));
    });

}); 


//UTILITIES

function stopAll(){
    player.stopVideo();
    if($('.audio-play i').hasClass('playing')){
       waves[0].stop();
       $('.audio-play i').removeClass('playing');
       $('.audio-play i').html('play_arrow');

    }

}

var show = function(e){
    if(!e.classList.contains("visible")) e.classList += " visible"; 
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
  

//Youtube view count




function getViews(vid, target) {
    console.log('fn start');
    $.get(
        "https://www.googleapis.com/youtube/v3/videos", {
            part: 'statistics',
            id: vid,
            key: 'AIzaSyDUeh5zIbtg_9dEYVNiFX2nrCC4iZ2l-fw'
        },
        function (data) {
            var o;
            console.log('data found');
            $.each(data.items, function (i, item) {
                console.log("COUNTER CALLED: "+ item.statistics.viewCount);
                $(target).text(item.statistics.viewCount);

            })
        }
    );
}



// JQERY FUNCTION TO REORDER LIST
function reorder(list) {
    
    var order = $(list).find('.visible').detach().sort(function(a,b) {
        
      var classA = $(a).data('i');
      var classB = $(b).data('i');
      console.log('reordering' + classA + " vs " + classB);
      return classB < classA;
    });
    $(list).append( order );
}


