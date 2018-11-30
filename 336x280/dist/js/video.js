/* eslint-disable */
import Mobile from './mobile'

export default class Video {
    constructor (options) {
        this.init(options)
    }

    init (options) {
        /* currently the content is pass in as jquery object, and need to change to javascript object */
        this.content = document.querySelector(options.selector);
        this.data = options.data;
        this.id = options.id;

        this.preview = options.preview;
        this.app = options.app;
        this.callbackEvents = options.events

        this.pauseVideo = () => {
            this.video.pause()
        }
        this.playVideo = () => {
            this.video.play()
        }
        this.getCurrentTime = () => {
            return this.video.currentTime;
        }
        this.getDuration = () => {
            return this.video.duration;
        }

        this.quality = 'low';

        if (typeof options.quality != 'undefined') {
            this.quality = options.quality;
        }

        /* variable which need to be manipulated for freeflow */
        this.videoContainer = document.getElementById('video-container-' + this.id);
        this.video = this.videoContainer.querySelector('#video');
        this.videoState = 0; //0 - unplayed, 1 - playing, 2 - pause. 3 - ended
        this.endingImage = document.getElementById('ending-image-' + this.id);
        this.autoplay = parseInt(this.data.autoplay); // 0 - none, 1 - autoplay, 2 - inview
        this.clickthrough = document.getElementById('clickthrough-container-' + this.id);
        this.replayBtn = document.getElementById('control-replay-' + this.id);
        this.clickable = document.getElementById('hosted-video-clickable-area-' + this.id)  || document.createElement('div');
        this.playTimeTracking = () =>  {
        };
        
        this.control = {
            audio : document.getElementById('default-control-audio-container-' + this.id),
            play : document.getElementById('default-control-play-container-' + this.id),
            replay : document.getElementById('default-control-replay-container-' + this.id)
        };
        this.overlay = this.videoContainer.querySelector('.overlay');

        this.timerInterval;
        this.tracked = [];
        this.videos_chunks = [];
        this.hoverEvent = false;

        this.canvasVideo = false;
        this.canvasVideoSwitched = false;

        /* TEMPORARY animation delay */
        if (this.autoplay != 0) {
            if (this.app.isMobile() && this.autoplay == 1) {
                this.autoplay = 2; //animating play is same as inview play
            } else if (this.autoplay == 2) {
                if (this.video != null) {
                    this.video.removeAttribute('autoplay');
                } 
            }
        }
        
        /* html5 */
        if (this.app.isMobile() && this.autoplay != 0) {

            if ( this.video != null ) {
                /* hide the html video */
                this.video.style.display = 'none'
                /* render mobile video */
                this.mobile();
                // this.mobile({
                //     'callback' : () =>  {
                //         var desktopVideo = this.videoContainer.querySelector('video') || this.videoContainer.querySelector('canvas');
                //         desktopVideo.parentNode.appendChild(this.video);
                //         this.events();

                //         /* create mute unmute function for desktop video */
                //         this.video.mute = () =>  {video.muted = true;};
                //         this.video.unmute = () =>  {video.muted = false;};
                //     }
                // });
                
            } else {
                this.video = this.videoContainer.querySelector('canvas');
            }

            this.canvasVideo = true;   
        } else {
            this.loadVideo()
        }

        /* create mute unmute function for desktop video */
        this.video.mute = () =>  {video.muted = true;};
        this.video.unmute = () =>  {video.muted = false;};
        
        if (this.app.isMobile() && this.autoplay != 0) {
            //this.video.style.display = 'none';
        } else {
            this.events();
        }

        if (this.autoplay == 1) {
            this.video.play();
        }
    }

    loadVideo () {
        var mp4 = document.createElement('source')
        mp4.src = this.data.src.mp4.replace('.mp4', '_' + this.quality + '.mp4')
        var webm = document.createElement('source')
        webm.src = this.data.src.mp4.replace('.webm', '_' + this.quality + '.webm')
        var ogg = document.createElement('source')
        ogg.src = this.data.src.mp4.replace('.ogg', '_' + this.quality + '.ogg')

        mp4.onerror = this.retarget.bind(this)

        this.video.appendChild(mp4);
        this.video.appendChild(webm);
        this.video.appendChild(ogg);
    }

    retarget (e) {
        /* insert the video source for desktop video */
        this.video.innerHTML =
            '<source src="' + this.data.src.mp4 + '" type="video/mp4" onerror="console.log(this);this.retarget(this)"/>\
            <source src="' + this.data.src.webm + '" type="video/webm" onerror="this.retarget(this)"/>\
            <source src="' + this.data.src.ogg + '" type="video/ogg" onerror="this.retarget(this)"/>';

    }

    /* Method to be used from controller */
    playVideo () {
        this.video.play();
    }

    events () {
        /* set some important styling - NJ */
        if (this.endingImage != null) {
            this.endingImage.style.display = 'none';
        }

        /* clickthrough */
        this.eventsClickthrough();
        /* control */
        this.eventsControl();

        /**/
        if (this.autoplay == 2) {
            if (!this.preview) {
                /* register inview and outview here */
            } else {
                this.video.play();
            }
        }
        

        this.video.addEventListener('play', () =>  {


            if (typeof this.videos_chunks != 'undefined') {
                while (this.videos_chunks.length != 0 && !this.canvasVideoSwitched) {
                
                    this.loadJSON(this.videos_chunks.shift(), (response) => {
                        var actual_JSON = JSON.parse(response);
                        this.images_list[actual_JSON['index']] = actual_JSON['c'];
                        if (typeof this.video.updateImagesUrl != 'undefined') {
                            this.video.updateImagesUrl(this.images_list)
                        }
                    }); 
                }
            }


            /* update video state */
            this.videoState = 1;
            /* tracker */
            this.tracker({
                type: 'video_play',
                tt : ''
            });

            this.playTimeTracking = setInterval(() =>  {
                this.trackPlayTime();
            }, 500);
        });
        this.video.addEventListener('pause', () =>  {

            /* video end will trigger pause event, so will need to check the time */
            if (this.video.currentTime < this.video.duration) {
                /* update video state */
                this.videoState = 2;

                /* tracker */
                this.tracker({
                    type: 'video_pause'
                });
            }
        });

        this.video.addEventListener('ended', () =>  {
            /* update video state */
            this.videoState = 3;
            /* tracker */
            this.tracker({
                type: 'video_play_100',
                tt : ''
            });
            /* ending image */
            this.eventsEndingImage();
            /* stop play time tracking */
            clearInterval(this.playTimeTracking)

            /* video loop - NJ */
            if (typeof this.data.loop != 'undefined' && this.data.loop) {
                this.play();
                /* hide replay */
                this.control.replay.querySelector('.dc-replay').style.display = 'none';
                this.control.play.querySelector('.dc-play').style.display = 'none';
                this.control.play.querySelector('.dc-pause').style.display = 'block';
            }
        })

        /* listen to post message */
        this.app.listen({
            callback: (resp) => {
                if (typeof resp.auth == 'undefined') {
                    return false;
                }
                /* inview */
                if (resp.auth.type == 'inview' && this.autoplay == 2) {
                    if (!this.video.ended) {
                        this.video.play();
                    }
                }
        
                /* outview */
                if (resp.auth.type == 'outview' && this.autoplay == 2) {
                    this.video.pause();
                }
        
                /* close exp */
                if (resp.auth.type == 'closeExpandable') {
                    this.video.pause();
                }
    
                if (resp.auth.type == 'openADC') {
                    this.video.play();
                    if ( this.hoverEvent == false ) {
                        this.video.onmouseover = function() {
                            this.mute(false);
                        };
                        this.hoverEvent = true;
                    }
                }
            }
        });

    }

    eventsEndingImage () {
        if (this.endingImage != null) {
            this.endingImage.style.display = 'block';
            this.clickable.style.height = '100%';
            this.clickable.style.zIndex = '11';

            this.endingImage.addEventListener('click', () => {
                if (this.data.endingImage.lpUrl) { // only open if landing url is not blank -yk
                    this.tracker({
                        type: 'end_image_click',
                        tt : 'CTR'
                    });
                    this.linkOpener({
                        url: this.data.endingImage.lpUrl
                    });
                }
            });

            this.video.addEventListener('play', () => {
                this.endingImage.style.display = 'none';

            });
        }
    }

    eventsClickthrough () {
        /* clickthrough */
        if (this.data.endingImage.lpUrl) {
            if (this.clickable != null) {
                this.clickable.setAttribute('href', '#')
                this.clickable.addEventListener('click', () =>  {
                    this.tracker({
                        type: 'end_image_click',
                        tt : 'CTR'
                    });
                    this.linkOpener({
                        url: this.data.endingImage.lpUrl
                    });
                })
            }
          
        }

        if (this.clickthrough != null) {
            this.clickthrough.addEventListener('click', () => {
                this.linkOpener({
                    url: this.data.clickthrough.lpUrl
                });
            })
        }
    }

    eventsReplayBtn () {
        if (this.replayBtn != '') {

            /* ended, show replay */
            this.video.addEventListener('ended', () =>  {
                this.replayBtn.querySelector('img').style.display = 'block';
            });

            this.replayBtn.querySelector('img').addEventListener('click', (e) =>  {
                this.video.unmute();
                this.video.play();
                e.target.style.display = 'none';

            })
        }
    }

    eventsControl () {
        if (this.control['play'] != 'undefined') {
            /* show play by default if it is non autoplay or inview autoplay */
            if (this.data.autoplay == 0) {
                this.control.play.querySelector('.dc-play').style.display = 'block';
                this.control.play.querySelector('.dc-pause').style.display = 'none';

                this.control.replay.querySelector('.dc-replay').style.display = 'none';

                /* if non autoplay unmute by default - NJ */
                this.control.audio.style.display = 'block';
                this.control.audio.querySelector('.dc-mute').style.display = 'block';
                this.control.audio.querySelector('.dc-unmute').style.display = 'none';

                /* unmute video by default - used in play event */
                this.unmuteDefault = true;
            }
            /* show pause by default if it is autoplay */
            else {
                this.control.play.querySelector('.dc-pause').style.display = 'block';
                this.control.play.querySelector('.dc-play').style.display = 'none';

                this.control.audio.querySelector('.dc-mute').style.display = 'none';
                this.control.audio.querySelector('.dc-unmute').style.display = 'block';

                /* mute video by default - used in play event  */
                this.unmuteDefault = false;
            }

            

            /* played, show mute/unmute */
            this.video.addEventListener('play', () =>  { 

                /* To mute or unmute video by default - on the first play only - NJ */
                if ( (this.data.autoplay == 0 && this.unmuteDefault && this.unmuteDefault != null) ) {
                    this.mute(false);
                    this.unmuteDefault = null;
                } else if (!this.unmuteDefault && this.unmuteDefault != null) {
                    //this.video.mute();
                    this.unmuteDefault = null;
                }
                
                /* play show/hide */
                this.control.play.querySelector('.dc-play').style.display = 'none';
                this.control.audio.style.display = 'block';
                this.control.play.querySelector('.dc-pause').style.display = 'block';

                /* make sure replay is hidden */
                this.control.replay.querySelector('.dc-replay').style.display = 'none';

                /* timer */
                var time_span = this.control.replay.querySelector('span');
                var time =  Math.round(this.video.duration) - Math.round(this.video.currentTime || 0);
                time = isNaN(time) ? '' : time;
                if (time_span != null) {
                    time_span.innerHTML = time;
                    time_span.style.display = 'block';
                }
                
                clearInterval(this.timerInterval)
                this.timerInterval = setInterval(() =>  { 
                    var time = Math.round(this.video.duration) - Math.round(this.video.currentTime);
                    time = isNaN(time) ? '' : time;
                    if (time_span != null) {
                        time_span.innerHTML = time;
                    }

                    /* video sync */
                    var v_duration = Math.round(this.video.duration);
                    var v_currentTime = Math.round(this.video.currentTime);
                    var perc_25 = Math.round(v_duration * 0.25);
                    var perc_50 = Math.round(v_duration * 0.5);
                    var perc_75 = Math.round(v_duration * 0.75);
                    
                    if (this.video.currentTime >= this.video.duration || (this.videoState != 1 && this.video.currentTime == 0) ) {
                        time_span.style.display = 'none';
                        clearInterval(this.timerInterval);
                    }
                    
                    if (this.videoState != 1) {
                        clearInterval(this.timerInterval);
                    }

                    if (typeof this.callbackEvents.onPlaying != 'undefined') {
                        this.callbackEvents.onPlaying(Math.round(this.video.currentTime));
                    }
                }, 1000);
            });
            /* for canvas switching - NJ */
            this.video.addEventListener('playing', () =>  {
                if (this.canvasVideoSwitched) {
                    this.overlay.style.display = 'none';
                }
            })
            /* pause, show replay */
            this.video.addEventListener('pause', () =>  {
                this.control.play.querySelector('.dc-play').style.display = 'block';
                this.control.play.querySelector('.dc-pause').style.display = 'none';
            });

            /* ended, show replay */
            this.video.addEventListener('ended', () =>  {
                this.control.play.querySelector('.dc-play').style.display = 'none';
                this.control.play.querySelector('.dc-pause').style.display = 'none';
                this.control.audio.style.display = 'none';
                //this.control.replay.querySelector('.dc-replay').style.display = 'block';

                setTimeout (() =>  {
                    this.control.replay.querySelector('.dc-replay').style.display = 'block';
                }, 1000)

                if (typeof this.callbackEvents.onPlaying != 'undefined') {
                    this.callbackEvents.onEnded();
                }
            });

            /* control events */
            this.control.play.querySelector('.dc-play').addEventListener('click', (e) =>  {
                this.video.play();
            })
            this.control.play.querySelector('.dc-pause').addEventListener('click', (e) =>  {
                this.video.pause();
            })
            this.control.audio.querySelector('.dc-mute').addEventListener('click', (e) =>  {
                this.mute(true);
            })
            this.control.audio.querySelector('.dc-unmute').addEventListener('click', (e) =>  {

                /* tracker */
                this.tracker({
                    type: 'video_unmute'
                });

                /* canvas switching */
                if (this.canvasVideo && !this.canvasVideoSwitched) {
                    this.canvasVideoSwitched = true;
                    this.canvas = this.video;

                    setTimeout(() =>  {
                        this.canvas.pause()
                        this.canvas.style.display = 'none';

                        this.canvas.parentNode.removeChild(this.canvas)
                    }, 1000);
                    
                    //this.overlay.style.display = 'block';

                    var currentTime = this.video.currentTime;

                    this.video = this.videoContainer.querySelector('#video');
                    this.video.currentTime = currentTime;
                    this.video.style.display = 'block';
                    this.mute(false);
                    
                    this.loadVideo()
                    this.events()
                    // this.video.play();
                    setTimeout( () =>  {
                        this.video.play();    
                    }, 1000)    
                }
                
                this.mute(false);
            })
            this.control.replay.querySelector('.dc-replay').addEventListener('click', (e) =>  {
                /* tracker */
                this.tracker({
                    type: 'video_replay'
                });
                this.mute(false);
                this.video.play();
                /* hide replay */
                e.target.style.display = 'none';

              this.clickable.removeAttribute('style')
              this.clickable.style.display = 'block';
              this.clickable.style.height = '';
              this.clickable.style.zIndex = '10';
            })

            if (this.data.mouseoutMute) {
                this.video.onmouseout = function() {
                    console.log('out');
                    this.mute(true);
                };
            }
        }
    }

    mute (mute) {
        if (mute) {
            this.video.mute();
            this.control.audio.querySelector('.dc-unmute').style.display = 'block';
            this.control.audio.querySelector('.dc-mute').style.display = 'none';
        } else {
            this.video.unmute();
            this.control.audio.querySelector('.dc-unmute').style.display = 'none';
            this.control.audio.querySelector('.dc-mute').style.display = 'block';
        }
    }

    linkOpener (options) {
        // console.log(options.url);
        this.app.open(options.url);
    }

    tracker (options) {

        if (!this.preview) {
            //console.log(options.type);
            this.app.tracker(typeof options.tt != 'undefined' ? options.tt : 'E', options.type, this.layer, this.layer, options.value || '');

            if ( typeof this.data.extTrackers != 'undefined' && this.data.extTrackers.enabled &&  (this.data.extTrackers.type == 0 || this.data.extTrackers.type == 1) ){
                this.extTracker({
                    type: options.type
                })
            } 
        }
    }

    extTracker (options) {
        /*
        * external tracker with dsp macro support ( tmc )
        */
        if (!this.preview && typeof this.data.extTrackers[options.type] != 'undefined' && this.data.extTrackers[options.type] != '') {
            
            var url = this.data.extTrackers[options.type];
            /* make sure we have received the macro */

            url = this.app.macro({
                url : this.data.extTrackers[options.type],
                dspMacro : this.app.dspMacro
            });

            /* js */
            if (this.data.extTrackers.type == 0) {
                var s = document.createElement('script');
                s.style.display = 'none';
                s.src = url;
            
                document.body.appendChild(s);
            }
            /* img */
            else if (this.data.extTrackers.type == 1) {
                var i = document.createElement('img');
                i.style.width = '1px';
                i.style.height = '1px';
                i.style.display = 'none';
                i.src = url;

                document.body.appendChild(i);
            }

            /* temporary trackers which fire when video_100 is fired for ext tracker */
            if (options.type == 'video_play_100') {
                this.tracker({
                    type : 'viewthrough',
                    value : encodeURIComponent(url) 
                })    
            }

            delete this.data.extTrackers[options.type];
        }
    }

    trackPlayTime () {
        var duration = this.video.duration;
        var currentTime = this.video.currentTime;

        if (currentTime >= duration && this.tracked.indexOf('video_play_100') < 0) {

            this.tracked.push('video_play_100');
            /* tracker */
            this.tracker({
                type: 'video_play_100',
                tt : ''
            });
            /* stop play time tracking */
            clearInterval(this.playTimeTracking)
        }
        else if (currentTime >= duration * 0.75 && this.tracked.indexOf('video_play_75') < 0) {
            this.tracked.push('video_play_75');
            /* tracker */
            this.tracker({
                type: 'video_play_75',
                tt : ''
            });
        }
        else if (currentTime >= duration * 0.5 && this.tracked.indexOf('video_play_50') < 0) {
            this.tracked.push('video_play_50');
            /* tracker */
            this.tracker({
                type: 'video_play_50',
                tt : ''
            });
        }
        else if (currentTime >= duration * 0.25 && this.tracked.indexOf('video_play_25') < 0) {
            this.tracked.push('video_play_25');
            /* tracker */
            this.tracker({
                type: 'video_play_25',
                tt : ''
            });
        }
    }

    mobile () {
        this.images_list = [];
        for (var i = 1; i <= Math.ceil(this.data.frames/20); i++) {
            
            if ( i <= 3 ) {

                this.loadJSON(this.data.src.img_url.replace('image_', '') + 'chunks' + i + '.json', (response) => {
                    // Parse JSON string into object
                    var actual_JSON = JSON.parse(response);
                    this.images_list[actual_JSON['index']] = actual_JSON['c'];

                    // Check if its first chunk 
                    if (actual_JSON['index'] == 0) {
                        // init video only if first chunk is loaded
                        this.video = new Mobile({
                            id: this.id,
                            fps: this.data.fps,
                            numberOfFrames: this.data.frames,
                            loop:this.data.loop,
                            dimensions: [{
                                width: this.data.w,
                                height: this.data.h,
                                imagesUrl: this.images_list
                            }],
                            defaultDimension: 0,
                            autoplay: this.autoplay == 1 ? true : false,
                        });
                        
                        var desktopVideo = this.videoContainer.querySelector('video') || this.videoContainer.querySelector('canvas');
                        desktopVideo.parentNode.appendChild(this.video);
                        this.events();

                        /* create mute unmute function for desktop video */
                        this.video.mute = function () {video.muted = true;};
                        this.video.unmute = function () {video.muted = false;};
                    
                        this.video.play();
                    }
                }); 

            } else {
                this.videos_chunks.push(this.data.src.img_url.replace('image_', '') + 'chunks' + i + '.json');
            }

            
        }
    }

    loadJSON (url, callback) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }
}