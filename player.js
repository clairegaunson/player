document.addEventListener('DOMContentLoaded', () => {
    // 1. HTML Elements
    const video = document.getElementById('my-video');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const seekBar = document.getElementById('seek-bar');
    const timeDisplay = document.getElementById('time-display');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const playerContainer = document.getElementById('player-container');

    // ==========================================================
    // 2. VIDEO URL SETTINGS (WITHOUT WORKER / DIRECT M3U8 LINK)
    // ==========================================================
    
    // 🛑 Humne Worker URL ko ignore kar diya hai.
    // Iski jagah, hum seedha ek working HLS stream daal rahe hain.
    // Yeh link 100% public hai aur chalna chahiye.
    const hlsUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'; 

    // Note: Agar aap koi aur Dailymotion link chalana chahen, 
    // toh pehle uska M3U8 link kisi aur tool se nikaal kar yahan daalna hoga.

    // ==========================================================
    
    // 3. HLS Player ko initialize karna
    if (Hls.isSupported()) {
        console.log("HLS supported. Initializing player with direct URL:", hlsUrl);
        var hls = new Hls({ enableWorker: true });
        
        hls.loadSource(hlsUrl); 
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            seekBar.max = video.duration;
            updateTimeDisplay();
        });
        
        hls.on(Hls.Events.ERROR, function(event, data) {
             console.error('HLS Error:', data);
             playPauseBtn.textContent = 'Error!'; 
        });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support
        console.log("Using native HLS support.");
        video.src = hlsUrl;
        video.addEventListener('loadedmetadata', function() {
            seekBar.max = video.duration;
            updateTimeDisplay();
        });
    }

    // 4. Custom Controls ka logic

    playPauseBtn.addEventListener('click', () => {
        if (video.paused || video.ended) {
            video.play();
            playPauseBtn.textContent = 'Pause';
        } else {
            video.pause();
            playPauseBtn.textContent = 'Play';
        }
    });

    video.addEventListener('timeupdate', () => {
        if (document.activeElement !== seekBar) {
            seekBar.value = video.currentTime;
        }
        updateTimeDisplay();
    });

    seekBar.addEventListener('input', () => {
        video.currentTime = seekBar.value;
        updateTimeDisplay();
    });

    fullscreenBtn.addEventListener('click', () => {
        if (playerContainer.requestFullscreen) {
            playerContainer.requestFullscreen();
        } else if (playerContainer.webkitRequestFullscreen) {
            playerContainer.webkitRequestFullscreen();
        } else if (playerContainer.msRequestFullscreen) {
            playerContainer.msRequestFullscreen();
        }
    });
    
    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        
        const parts = [];
        if (h > 0) parts.push(h);
        parts.push(m < 10 && h > 0 ? "0" + m : m : m);
        parts.push(s < 10 ? "0" + s : s);
        
        return parts.join(':');
    }

    function updateTimeDisplay() {
        const current = formatTime(video.currentTime);
        const duration = formatTime(video.duration || 0);
        timeDisplay.textContent = `${current} / ${duration}`;
    }
});
