/* eslint-disable */
import Mads from 'mads-custom';
import './main.css';
import Video from './js/video';

class AdUnit extends Mads {
  constructor() {
    super();
    let _this = this
    
  }

  render() {
    // console.log('data', this.data);

    // this.custTracker = ['http://www.tracker.com?type={{rmatype}}&tt={{rmatt}}'];

    // this.tracker('CTR', 'test');

    // this.linkOpener('http://www.google.com');

    return `
        <div class="container">
            <div id="orientation">
                <img src="${this.data.orientation}"/>
            </div>
            <div class="video">
                <div id="ff_layer_0"><div id="video-container-1" class="video-container" style="height: ${this.data.height}px; width: ${this.data.width}px">
                    <a id="hosted-video-clickable-area-1" href="#" class="hosted-video-clickable-area"></a>
                    <div id="default-control-audio-container-1" class="default-control-audio-container">
                        <img src="//cdn.richmediaads.com/html5/images/media/video/mute-v3.png" class="dc-unmute " style="display:none;">   
                        <img src="//cdn.richmediaads.com/html5/images/media/video/unmute-v3.png" class="dc-mute" style="display: block;">
                    </div>
                    <div id="default-control-play-container-1" class="default-control-play-container">
                        <img src="//cdn.richmediaads.com/html5/images/media/video/play-v3.png" class="dc-play" style="display: block;">              
                        <img src="//cdn.richmediaads.com/html5/images/media/video/pause-v3.png" class="dc-pause">
                    </div>
                    <div id="default-control-replay-container-1" class="default-control-replay-container">
                        <img src="//cdn.richmediaads.com/html5/images/media/video/replay-v3.png" class="dc-replay">
                        <span></span>
                    </div>
                    <video id="video" width="${this.data.width}" height="${this.data.height}" muted=""></video>
                </div></div>
            </div>
            <div class="icons">

                <div class="first icon slide-in-fwd-center">
                    <div class="line"></div>
                    <img src="${this.data.icon_one}" class="click_popup jello-horizontal" target="one"/>
                </div>
                
                <div class="second icon slide-in-fwd-center">
                    <div class="line"></div>
                    <img src="${this.data.icon_two}" class="click_popup jello-horizontal" target="two"/>
                </div>
                
                <div class="third icon slide-in-fwd-center">
                    <div class="line"></div>
                    <img src="${this.data.icon_three}" class="click_popup jello-horizontal" target="three"/>
                </div>
                
                <div class="forth icon slide-in-fwd-center">
                    <div class="line"></div>
                    <img src="${this.data.icon_four}" class="click_popup jello-horizontal" target="four"/>
                </div>
                <img src="${this.data.banner_one}" id="ending-image"/>
            </div>
            <div class="popup">
                <img src="${this.data.banner_one}" class="banner one"/>
                <img src="${this.data.banner_two}" class="banner two"/>
                <img src="${this.data.banner_three}" class="banner three"/>
                <img src="${this.data.banner_four}" class="banner four"/>

                <div class="close fade-in">Resume Video</div>
            </div>
        </div>
    `;
  }

  style() {
    const links = [];

    return [...links,
      `
      body {
      }
      `];
  }

  events() {
    this.orientation = document.getElementById('orientation');
    this.video = document.querySelector('.video');
    this.icons = document.querySelector('.icons');

    if (this.data.showOrientation) {
        setTimeout(() => {
            this.orientation.style.display = 'none';
        }, 2000)

        setTimeout(() => {
            this.video.style.display = 'block';
            this.icons.style.display = 'block';
            this.loadDelay();
        }, 1000)
    } else {
        this.orientation.style.display = 'none';
        this.video.style.display = 'block';
        this.icons.style.display = 'block';
        this.loadDelay();
    }
  }

  loadDelay () {
 
    var param = {"w":480,"h":320,"fps":10,"frames":204,"length":20.417,"src":{"mp4":"https://rmarepo.richmediaads.com/2594/videos/iLotte_Video_20s.mp4","webm":"https://rmarepo.richmediaads.com/2594/videos/iLotte_Video_20s.webm","ogg":"https://rmarepo.richmediaads.com/2594/videos/iLotte_Video_20s.ogg","img_url":"https://rmarepo.richmediaads.com/2594/images/autoplay/j8okn/image_","audio_url":"https://rmarepo.richmediaads.com/2594/images/autoplay/j8okn/audio.mp3","file":"https://rmarepo.richmediaads.com/2594/videos/iLotte_Video_20s.mp4","size":0},"coverImage":{"src":"","action":0,"lpUrl":""},"endingImage":{"src":"","action":0,"lpUrl":""},"control":1,"autoplay":"1","clickthrough":{"txt":"Click Here","lpUrl":""},"extTrackers":{"ytPlay":"","enabled":true}};
    // var param = {"w":336,"h":280,"fps":10,"frames":204,"length":20.417,"src":{"mp4":"https://rmarepo.richmediaads.com/2594/videos/iLotte_Video_20s.mp4","webm":"https://rmarepo.richmediaads.com/2594/videos/iLotte_Video_20s.webm","ogg":"https://rmarepo.richmediaads.com/2594/videos/iLotte_Video_20s.ogg","img_url":"https://rmarepo.richmediaads.com/2594/images/autoplay/2e48w1u/image_","audio_url":"https://rmarepo.richmediaads.com/2594/images/autoplay/2e48w1u/audio.mp3","file":"https://rmarepo.richmediaads.com/2594/videos/iLotte_Video_20s.mp4","size":0},"coverImage":{"src":"","action":0,"lpUrl":""},"endingImage":{"src":"","action":0,"lpUrl":""},"control":1,"autoplay":"1","clickthrough":{"txt":"Click Here","lpUrl":""},"extTrackers":{"ytPlay":"","enabled":true}};

    this.endImage = document.getElementById('ending-image');
    this.ended = false;
    this.video = new Video({
        app : this,
        selector: '#ff_hostedvideo_1',
        data: param,
        layer: 0,
        id: 1,
        preview: this.preview,
        animationDelay : 0, //temporary - check used in video js
        animation : true,
        replay : false,
        quality : 'mid', // hd, low, mid, empty for original, default is low
        events : {
            onPlaying : (time) => {
                if (time >= 1) {
                    document.querySelector('.first.icon').style.display = 'block'
                }

                if (time >= 1.5) {
                    document.querySelector('.second.icon').style.display = 'block'
                }

                if (time >= 2.5) {
                    document.querySelector('.third.icon').style.display = 'block'
                }

                if (time >= 3.5) {
                    document.querySelector('.forth.icon').style.display = 'block'
                }
            },
            onEnded : () => {
                this.endImage.style.display = 'block'
                this.ended = true;
            }
        }
    });

    this.endImage.addEventListener('click', () => {
        this.linkOpener(this.data.clickthrough_one);
        this.tracker('CTR', 'endimg_clickthrough');
    })

    let popup = document.querySelector('.popup');
    let banner = {
        one : document.querySelector('.banner.one'),
        two : document.querySelector('.banner.two'),
        three : document.querySelector('.banner.three'),
        four : document.querySelector('.banner.four'),
    }
    
    let click_popup = document.querySelectorAll(".click_popup");
    let close = document.querySelector(".close");

    click_popup.forEach((click) => {

        click.addEventListener('click', (e) => {
            
            let target = e.target.getAttribute('target')

            this.tracker('E', 'popup_' + target);

            popup.style.display = 'block'
            banner[target].style.display = 'block'
            this.video.pauseVideo()

            popup.classList.add('slide-in-bottom');
            popup.classList.remove('slide-out-bottom');
        })
    });

    close.addEventListener('click', (e) => {
            
        // popup.style.display = 'none'
        popup.classList.remove('slide-in-bottom');
        popup.classList.add('slide-out-bottom');

        setTimeout(() => {
            banner.one.style.display = 'none'
            banner.two.style.display = 'none'
            banner.three.style.display = 'none'
            banner.four.style.display = 'none'
        }, 500)

        if (!this.ended) {
            this.video.playVideo()
        }
    })

    banner.one.addEventListener('click', () => {
        this.linkOpener(this.data.clickthrough_one);
        this.tracker('CTR', 'clickthrough_one');
    })
    banner.two.addEventListener('click', () => {
        this.linkOpener(this.data.clickthrough_two);
        this.tracker('CTR', 'clickthrough_two');
    })
    banner.three.addEventListener('click', () => {
        this.linkOpener(this.data.clickthrough_three);
        this.tracker('CTR', 'clickthrough_three');
    })
    banner.four.addEventListener('click', () => {
        this.linkOpener(this.data.clickthrough_four);
        this.tracker('CTR', 'clickthrough_four');
    })
  }

  isMobile () {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ) {
        return true;
    }
    else {
        return false;
    }
  }

  listen (options) {
    var receiveMessage = function (event) {
        // console.log('receiveMessage')
        // console.log(event)
        options.callback(event.data);
    }
    window.addEventListener("message", receiveMessage, false);
  }
}

window.ad = new AdUnit();
