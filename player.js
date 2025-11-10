document.addEventListener('DOMContentLoaded', () => {
    // 1. HTML Elements ko uthana
    const video = document.getElementById('my-video');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const seekBar = document.getElementById('seek-bar');
    const timeDisplay = document.getElementById('time-display');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const playerContainer = document.getElementById('player-container'); 

    // ==========================================================
    // 2. VIDEO URL SETTINGS (Direct M3U8 Link for Testing)
    // ==========================================================
    
    // Test karne ke liye, hum seedha HLS stream ka URL istemaal kar rahe hain.
    // Jab aapke paas Dailymotion ka working M3U8 link ho, toh aap yahan daal sakte hain.
    const hlsUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'; 

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
            // Video ko chalaane ki koshish karein
            video.play().catch(e => console.log("Autoplay blocked:", e)); 
        });
        
        hls.on(Hls.Events.ERROR, function(event, data) {
             console.error('HLS Error:', data);
             playPauseBtn.textContent = 'Error!'; 
        });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari ke liye)
        console.log("Using native HLS support.");
        video.src = hlsUrl;
        video.addEventListener('loadedmetadata', function() {
            seekBar.max = video.duration;
            updateTimeDisplay();
        });
    }

    // 4. Custom Controls ka logic (Sahi syntax ke saath)

    // Play/Pause button
    playPauseBtn.addEventListener('click', () => {
        if (video.paused || video.ended) {
            video.play();
            playPauseBtn.textContent = 'Pause';
        } else {
            video.pause();
            playPauseBtn.textContent = 'Play';
        }
    });

    // Time update aur Seek Bar sync
    video.addEventListener('timeupdate', () => {
        if (document.activeElement !== seekBar) {
            seekBar.value = video.currentTime;
        }
        updateTimeDisplay();
    });

    // Seeking
    seekBar.addEventListener('input', () => {
        video.currentTime = seekBar.value;
        updateTimeDisplay();
    });

    // Fullscreen button
    fullscreenBtn.addEventListener('click', () => {
        if (playerContainer.requestFullscreen) {
            playerContainer.requestFullscreen();
        } else if (playerContainer.webkitRequestFullscreen) {
            playerContainer.webkitRequestFullscreen();
        } else if (playerContainer.msRequestFullscreen) {
            playerContainer.msRequestFullscreen();
        }
    });
    
    // Time format function (Syntax error yahan fix kiya gaya hai)
    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        
        const parts = [];
        if (h > 0) parts.push(h);
        
        // Conditional zero padding for minutes and seconds
        parts.push((h > 0 && m < 10) ? "0" + m : m);
        parts.push(s < 10 ? "0" + s : s);
        
        return parts.join(':');
    }

    // Time display update function
    function updateTimeDisplay() {
        const current = formatTime(video.currentTime);
        const duration = formatTime(video.duration || 0);
        timeDisplay.textContent = `${current} / ${duration}`;
    }
});
