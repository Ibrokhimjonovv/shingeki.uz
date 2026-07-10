import "./video-player.css"

export class VideoPlayer {
    constructor(container, options = {}) {
      this.container = container;
      this.options = {
        src: '',
        poster: '',
        title: '',
        autoplay: false,
        ...options
      };
      
      this.videoRef = null;
      this.state = {
        isPlaying: false,
        isPaused: true,
        isEnded: false,
        isLoading: false,
        isMuted: false,
        volume: 1,
        currentTime: 0,
        duration: 0,
        progress: 0,
        buffered: 0,
        playbackSpeed: 1
      };
      
      this.init();
    }
  
    init() {
      this.render();
      this.setupEvents();
      this.loadVideo();
    }
  
    render() {
      this.container.innerHTML = `
        <div class="video-player-custom">
          <!-- Loading spinner -->
          <div class="vp-loading" style="display:none;">
            <div class="spinner"></div>
          </div>
  
          <!-- Video element -->
          <video class="vp-video" 
                 poster="${this.options.poster}" 
                 preload="metadata"
                 playsinline>
            <source src="" type="video/mp4">
            Brauzeringiz video qo'llab-quvvatlamaydi.
          </video>
  
          <!-- Center play button -->
          <div class="vp-center-play">
            <svg viewBox="0 0 24 24" width="60" height="60">
              <circle cx="12" cy="12" r="11" fill="none" stroke="white" stroke-width="1.5" opacity="0.9"/>
              <polygon points="9,7 18,12 9,17" fill="white"/>
            </svg>
          </div>
  
          <!-- Controls -->
          <div class="vp-controls">
            <!-- Progress bar -->
            <div class="vp-progress-container">
              <div class="vp-progress-hover-tooltip" style="display:none;">0:00</div>
              <div class="vp-progress-track">
                <div class="vp-buffered-bar" style="width:0%"></div>
                <div class="vp-progress-bar" style="width:0%"></div>
                <div class="vp-progress-thumb" style="left:0%"></div>
              </div>
            </div>
  
            <div class="vp-controls-row">
              <div class="vp-left">
                <button class="vp-btn vp-play-btn" title="Play/Pause (Space)">
                  <svg class="vp-icon-play" viewBox="0 0 24 24" width="20" height="20">
                    <polygon points="6,4 20,12 6,20" fill="white"/>
                  </svg>
                  <svg class="vp-icon-pause" viewBox="0 0 24 24" width="20" height="20" style="display:none;">
                    <rect x="5" y="4" width="5" height="16" fill="white"/>
                    <rect x="14" y="4" width="5" height="16" fill="white"/>
                  </svg>
                  <svg class="vp-icon-replay" viewBox="0 0 24 24" width="20" height="20" style="display:none;">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="white"/>
                  </svg>
                </button>
  
                <div class="vp-time">
                  <span class="vp-current">0:00</span>
                  <span> / </span>
                  <span class="vp-duration">0:00</span>
                </div>
              </div>
  
              <div class="vp-right">
                <!-- Volume -->
                <div class="vp-volume-container">
                  <button class="vp-btn vp-volume-btn" title="Ovoz (M)">
                    <svg class="vp-icon-volume-high" viewBox="0 0 24 24" width="18" height="18">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="white"/>
                    </svg>
                    <svg class="vp-icon-volume-mute" viewBox="0 0 24 24" width="18" height="18" style="display:none;">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="white"/>
                    </svg>
                  </button>
                  <input type="range" class="vp-volume-slider" min="0" max="100" value="100" />
                </div>
  
                <!-- Fullscreen -->
                <button class="vp-btn vp-fullscreen-btn" title="To'liq ekran (F)">
                  <svg class="vp-icon-fullscreen" viewBox="0 0 24 24" width="18" height="18">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="white"/>
                  </svg>
                  <svg class="vp-icon-fullscreen-exit" viewBox="0 0 24 24" width="18" height="18" style="display:none;">
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" fill="white"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
  
      this.videoRef = this.container.querySelector('.vp-video');
    }
  
    async loadVideo() {
      const src = this.options.src;
      if (!src || src === '-') return;
  
      this.showLoading(true);
  
      try {
        let videoUrl = src;
  
        // Iframe tekshirish
        if (src.includes('<iframe')) {
          this.renderIframe(src);
          return;
        }
  
        // Presigned URL kerak bo'lsa
        if (this.needsPresignedUrl(src)) {
          const { api } = await import('../api.js');
          videoUrl = await api.getVideoUrl(src);
        }
  
        this.videoRef.src = videoUrl;
      } catch (e) {
        console.error('Video yuklash xatosi:', e);
        this.showError();
      }
    }
  
    needsPresignedUrl(url) {
      return url.includes('.r2.dev') || 
             url.startsWith('videos/') ||
             (!url.includes('.mp4') && !url.includes('http'));
    }
  
    renderIframe(iframeCode) {
      this.container.innerHTML = `
        <div class="video-player-custom">
          <div class="vp-iframe-wrapper">
            ${iframeCode}
          </div>
        </div>
      `;
    }
  
    showLoading(show) {
      const loader = this.container.querySelector('.vp-loading');
      if (loader) loader.style.display = show ? 'flex' : 'none';
    }
  
    showError() {
      this.container.innerHTML = `
        <div class="player__placeholder">
          <span>⚠️</span>
          <p>Video yuklashda xatolik</p>
          <small>Qayta urinib ko'ring yoki Telegram kanalimizga o'ting</small>
        </div>
      `;
    }
  
    setupEvents() {
      if (!this.videoRef) return;
  
      const video = this.videoRef;
      const container = this.container.querySelector('.video-player-custom');
      if (!container) return;
  
      // Video events
      video.addEventListener('loadstart', () => this.showLoading(true));
      video.addEventListener('canplay', () => this.showLoading(false));
      video.addEventListener('playing', () => {
        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.state.isEnded = false;
        this.updatePlayButton();
      });
      video.addEventListener('pause', () => {
        this.state.isPlaying = false;
        this.state.isPaused = true;
        this.updatePlayButton();
      });
      video.addEventListener('ended', () => {
        this.state.isEnded = true;
        this.state.isPlaying = false;
        this.updatePlayButton();
      });
      video.addEventListener('timeupdate', () => this.updateProgress());
      video.addEventListener('progress', () => this.updateBuffered());
      video.addEventListener('waiting', () => this.showLoading(true));
  
      // Play/Pause
      const playBtn = container.querySelector('.vp-play-btn');
      const centerPlay = container.querySelector('.vp-center-play');
      
      const togglePlay = () => {
        if (video.paused || video.ended) {
          if (video.ended) video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      };
  
      playBtn?.addEventListener('click', togglePlay);
      centerPlay?.addEventListener('click', togglePlay);
      video.addEventListener('click', togglePlay);
  
      // Double click skip
      video.addEventListener('dblclick', (e) => {
        const rect = video.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x > rect.width / 2) {
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
        } else {
          video.currentTime = Math.max(0, video.currentTime - 10);
        }
      });
  
      // Progress bar
      const progressTrack = container.querySelector('.vp-progress-track');
      const progressContainer = container.querySelector('.vp-progress-container');
      const tooltip = container.querySelector('.vp-progress-hover-tooltip');
  
      progressTrack?.addEventListener('click', (e) => {
        const rect = progressTrack.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
      });
  
      progressContainer?.addEventListener('mousemove', (e) => {
        const rect = progressTrack.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const time = percent * video.duration;
        if (tooltip) {
          tooltip.style.display = 'block';
          tooltip.style.left = (e.clientX - rect.left) + 'px';
          tooltip.textContent = this.formatTime(time);
        }
      });
  
      progressContainer?.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.style.display = 'none';
      });
  
      // Volume
      const volumeBtn = container.querySelector('.vp-volume-btn');
      const volumeSlider = container.querySelector('.vp-volume-slider');
  
      volumeBtn?.addEventListener('click', () => {
        video.muted = !video.muted;
        this.state.isMuted = video.muted;
        volumeSlider.value = video.muted ? 0 : video.volume * 100;
        this.updateVolumeIcon();
      });
  
      volumeSlider?.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        video.volume = val;
        video.muted = val === 0;
        this.state.isMuted = val === 0;
        this.state.volume = val;
        this.updateVolumeIcon();
      });
  
      // Speed
      const speedBtn = container.querySelector('.vp-speed-btn');
      const speedMenu = container.querySelector('.vp-speed-menu');
      const speedLabel = container.querySelector('.vp-speed-label');
  
      speedBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        speedMenu.style.display = speedMenu.style.display === 'none' ? 'block' : 'none';
      });
  
      container.querySelectorAll('.vp-speed-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const speed = parseFloat(btn.dataset.speed);
          video.playbackRate = speed;
          this.state.playbackSpeed = speed;
          if (speedLabel) speedLabel.textContent = speed + 'x';
          speedMenu.style.display = 'none';
        });
      });
  
      document.addEventListener('click', () => {
        if (speedMenu) speedMenu.style.display = 'none';
      });
  
      // Fullscreen
      const fullscreenBtn = container.querySelector('.vp-fullscreen-btn');
      fullscreenBtn?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          container.requestFullscreen?.() || container.webkitRequestFullscreen?.();
        } else {
          document.exitFullscreen?.() || document.webkitExitFullscreen?.();
        }
      });
  
      document.addEventListener('fullscreenchange', () => {
        const isFull = !!document.fullscreenElement;
        const iconFull = container.querySelector('.vp-icon-fullscreen');
        const iconExit = container.querySelector('.vp-icon-fullscreen-exit');
        if (iconFull) iconFull.style.display = isFull ? 'none' : 'block';
        if (iconExit) iconExit.style.display = isFull ? 'block' : 'none';
      });
  
      // Keyboard
      document.addEventListener('keydown', (e) => {
        if (document.activeElement?.tagName === 'INPUT' || 
            document.activeElement?.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
          case ' ':
            e.preventDefault();
            togglePlay();
            break;
          case 'ArrowRight':
            video.currentTime = Math.min(video.duration, video.currentTime + 5);
            break;
          case 'ArrowLeft':
            video.currentTime = Math.max(0, video.currentTime - 5);
            break;
          case 'ArrowUp':
            e.preventDefault();
            video.volume = Math.min(1, video.volume + 0.1);
            volumeSlider.value = video.volume * 100;
            break;
          case 'ArrowDown':
            e.preventDefault();
            video.volume = Math.max(0, video.volume - 0.1);
            volumeSlider.value = video.volume * 100;
            break;
          case 'm':
          case 'M':
            video.muted = !video.muted;
            this.updateVolumeIcon();
            break;
          case 'f':
          case 'F':
            fullscreenBtn?.click();
            break;
        }
      });
    }
  
    updateProgress() {
      if (!this.videoRef) return;
      const video = this.videoRef;
      const percent = (video.currentTime / video.duration) * 100 || 0;
      
      const progressBar = this.container.querySelector('.vp-progress-bar');
      const thumb = this.container.querySelector('.vp-progress-thumb');
      const currentTime = this.container.querySelector('.vp-current');
      const duration = this.container.querySelector('.vp-duration');
  
      if (progressBar) progressBar.style.width = percent + '%';
      if (thumb) thumb.style.left = percent + '%';
      if (currentTime) currentTime.textContent = this.formatTime(video.currentTime);
      if (duration && video.duration) duration.textContent = this.formatTime(video.duration);
    }
  
    updateBuffered() {
      if (!this.videoRef) return;
      const video = this.videoRef;
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percent = (bufferedEnd / video.duration) * 100 || 0;
        const bufferedBar = this.container.querySelector('.vp-buffered-bar');
        if (bufferedBar) bufferedBar.style.width = percent + '%';
      }
    }
  
    updatePlayButton() {
      const iconPlay = this.container.querySelector('.vp-icon-play');
      const iconPause = this.container.querySelector('.vp-icon-pause');
      const iconReplay = this.container.querySelector('.vp-icon-replay');
      const centerPlay = this.container.querySelector('.vp-center-play');
  
      if (iconPlay) iconPlay.style.display = this.state.isPlaying ? 'none' : 'block';
      if (iconPause) iconPause.style.display = this.state.isPlaying && !this.state.isEnded ? 'block' : 'none';
      if (iconReplay) iconReplay.style.display = this.state.isEnded ? 'block' : 'none';
      if (centerPlay) centerPlay.style.display = !this.state.isPlaying || this.state.isEnded ? 'flex' : 'none';
    }
  
    updateVolumeIcon() {
      const iconHigh = this.container.querySelector('.vp-icon-volume-high');
      const iconMute = this.container.querySelector('.vp-icon-volume-mute');
      if (iconHigh) iconHigh.style.display = this.state.isMuted ? 'none' : 'block';
      if (iconMute) iconMute.style.display = this.state.isMuted ? 'block' : 'none';
    }
  
    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '0:00';
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      return `${m}:${s.toString().padStart(2, '0')}`;
    }
  
    destroy() {
      if (this.videoRef) {
        this.videoRef.pause();
        this.videoRef.src = '';
      }
      this.container.innerHTML = '';
    }
  }