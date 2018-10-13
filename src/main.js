/* global window */
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
    console.log('data', this.data);

    this.custTracker = ['http://www.tracker.com?type={{rmatype}}'];

    // this.tracker('CTR', 'test');

    // this.linkOpener('http://www.google.com');

    return `
        <div class="container">
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
            </div>
            <div class="popup">
                <img src="${this.data.banner_one}" class="banner one"/>
                <img src="${this.data.banner_two}" class="banner two"/>
                <img src="${this.data.banner_three}" class="banner three"/>
                <img src="${this.data.banner_four}" class="banner four"/>

                <div class="close">Close</div>
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
    var param = {"w":480,"h":320,"fps":10,"frames":204,"length":20.417,"src":{"mp4":"https://rmarepo.richmediaads.com/2594/videos/iLotte_Video_20s.mp4","webm":"https://rmarepo.richmediaads.com/2594/videos/iLotte_Video_20s.webm","ogg":"https://rmarepo.richmediaads.com/2594/videos/iLotte_Video_20s.ogg","img_url":"https://rmarepo.richmediaads.com/2594/images/autoplay/j8okn/image_","audio_url":"https://rmarepo.richmediaads.com/2594/images/autoplay/j8okn/audio.mp3","file":"https://rmarepo.richmediaads.com/2594/videos/iLotte_Video_20s.mp4","size":0},"coverImage":{"src":"","action":0,"lpUrl":""},"endingImage":{"src":"","action":0,"lpUrl":""},"control":1,"autoplay":"1","clickthrough":{"txt":"Click Here","lpUrl":""},"extTrackers":{"ytPlay":"","enabled":true}};
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
        events : {
            onPlaying : (time) => {
                if (time >= 1) {
                    document.querySelector('.first.icon').style.display = 'block'
                }

                if (time >= 6) {
                    document.querySelector('.second.icon').style.display = 'block'
                }

                if (time >= 9) {
                    document.querySelector('.third.icon').style.display = 'block'
                }

                if (time >= 13) {
                    document.querySelector('.forth.icon').style.display = 'block'
                }
            }
        }
    });

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
        })
    });

    close.addEventListener('click', (e) => {
            
        popup.style.display = 'none'
        banner.one.style.display = 'block'
        banner.two.style.display = 'block'
        banner.three.style.display = 'block'
        banner.four.style.display = 'block'
        this.video.playVideo()
    })

    banner.one.addEventListener('click', () => {
        this.linkOpener('https://www.ilotte.com/promo-amaz1ng-ilotte-1st-anniversary-000000115653.do?ch=ETC9QSRJPJ&utm_medium=mobile_cpv&utm_source=aoc&utm_campaign=video-ads&utm_content=1stanniv&utm_term=amaz1ngilotte');
        this.tracker('E', 'clickthrough_one');
    })
    banner.two.addEventListener('click', () => {
        this.linkOpener('https://www.ilotte.com/promo-sport-festive-000000115675.do?ch=ETCLQO9JB7&utm_medium=mobile_cpv&utm_source=aoc&utm_campaign=video-ads&utm_content=sportfestive&utm_term=amaz1ngilotte');
        this.tracker('E', 'clickthrough_two');
    })
    banner.three.addEventListener('click', () => {
        this.linkOpener('https://www.ilotte.com/promo-100-global-top-brand-000000115719.do?ch=ETCICI1CFL&utm_medium=mobile_cpv&utm_source=aoc&utm_campaign=video-ads&utm_content=global100brand&utm_term=amaz1ngilotte');
        this.tracker('E', 'clickthrough_three');
    })
    banner.four.addEventListener('click', () => {
        this.linkOpener('https://www.ilotte.com/promo-the-biggest-korean-beauty-fair-000000115841.do?ch=ETCLOL1PWK&utm_medium=mobile_cpv&utm_source=aoc&utm_campaign=video-ads&utm_content=-k-beautyfair&utm_term=amaz1ngilotte');
        this.tracker('E', 'clickthrough_four');
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
        options.callback(event.data);
    }
    window.addEventListener("message", receiveMessage, false);
  }
}

window.ad = new AdUnit();
