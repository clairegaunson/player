document.addEventListener('DOMContentLoaded', () => {
    // 1. Zaroori HTML Elements ko uthana (Fetch required HTML elements)
    const video = document.getElementById('my-video');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const seekBar = document.getElementById('seek-bar');
    const timeDisplay = document.getElementById('time-display');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const playerContainer = document.getElementById('player-container'); // Fullscreen ke liye

    // ==========================================================
    // 2. CONFIGURATION (Isey zaroor check karein)
    // ==========================================================
    
    // Aapka Deployed Cloudflare Worker URL
    // (Aapke case mein yeh URL sahi hona chahiye)
    const workerBaseUrl = 'https://video-proxy.ia297945.workers.dev'; 

    // ⚠️ Yahan aap woh URL den jise aap play karna chahte hain (Dailymotion ya koi aur)
    const originalUrl = 'https://www.dailymotion.com/video/k6DKKtEiwhK7s6E8NRO'; 
    
    // Worker ko call karne wala final URL
    // Yeh URL Dailymotion URL ko 'videoUrl' parameter mein daal kar Worker ke paas bhejta hai.
    const hlsUrl = `${workerBaseUrl}/?videoUrl=${encodeURIComponent(originalUrl)}`;

    // ==========================================================
    
    // 3. HLS Player ko initialize karna (Initialize the HLS Player)
    if (Hls.isSupported()) {
        console.log("HLS supported. Initializing player with worker URL:", hlsUrl);
        var hls = new Hls({
            // Worker ko use karne se performance behtar hogi
            enableWorker: true 
        });
        
        // Worker URL ko HLS library ko dena
        hls.loadSource(hlsUrl); 
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            // Manifest load hone ke baad, seekbar ki max value set karna
            seekBar.max = video.duration;
            updateTimeDisplay();
        });
        
        hls.on(Hls.Events.ERROR, function(event, data) {
             console.error('HLS Error:', data);
             // Agar error ho toh user ko bata sakte hain
             playPauseBtn.textContent = 'Error!'; 
        });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (mostly Safari)
        console.log("Using native HLS support.");
        video.src = hlsUrl;
        video.addEventListener('loadedmetadata', function() {
            seekBar.max = video.duration;
            updateTimeDisplay();
        });
    }

    // 4. Custom Controls ka logic (Handle Custom Controls)

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
        // Agar user seekbar drag nahi kar raha, toh video time ko sync karein
        if (document.activeElement !== seekBar) {
            seekBar.value = video.currentTime;
        }
        updateTimeDisplay();
    });

    // Seeking (Jab user seekbar move kare)
    seekBar.addEventListener('input', () => {
        video.currentTime = seekBar.value;
        updateTimeDisplay();
    });

    // Fullscreen button
    fullscreenBtn.addEventListener('click', () => {
        if (playerContainer.requestFullscreen) {
            playerContainer.requestFullscreen();
        } else if (playerContainer.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            playerContainer.webkitRequestFullscreen();
        } else if (playerContainer.msRequestFullscreen) { /* IE/Edge */
            playerContainer.msRequestFullscreen();
        }
    });
    
    // Time format function
    function formatTime(seconds) {
        // Time ko HH:MM:SS ya MM:SS format mein dikhana
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        
        const parts = [];
        if (h > 0) parts.push(h);
        parts.push(m < 10 && h > 0 ? "0" + m : m);
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