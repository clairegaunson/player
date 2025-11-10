document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('dm-iframe');
    
    // 🛑 Zaroori: Apni Dailymotion video ID yahan daalen
    const VIDEO_ID = 'k6DKKtEiwhK7s6E8NRO'; 
    
    // 🔑 Yahan APNA ASLI PASSWORD daalen, jo aapne Dailymotion par set kiya hai
    const VIDEO_PASSWORD = 'YOUR_SECRET_VIDEO_PASSWORD'; // <--- **ISE BADALEN**
    
    // Safety check
    if (!iframe) {
        console.error("Fatal Error: Iframe element with ID 'dm-iframe' not found.");
        return; 
    }

    if (VIDEO_PASSWORD === 'Kitaunsa786!2020' || !VIDEO_PASSWORD) {
        alert("Configuration Error: Please update the VIDEO_PASSWORD in player.js with your actual password.");
        return;
    }

    // Embed URL banaana, jismein password shamil ho
    const embedUrl = `https://www.dailymotion.com/embed/video/${VIDEO_ID}?queue-autoplay-next=false&autoplay=1&password=${encodeURIComponent(VIDEO_PASSWORD)}`;
    
    console.log("Loading Dailymotion Embed Player with Hardcoded Password.");
    iframe.src = embedUrl;
});
