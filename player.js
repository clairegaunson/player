document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('dm-iframe');
    
    // 🛑 Zaroori: Apni Dailymotion video ID yahan daalen
    const VIDEO_ID = 'k6DKKtEiwhK7s6E8NRO'; // Agar yehi ID hai to theek hai, warna badal den
    
    // Default password (khali chhod dein taake user khud likhe)
    const DEFAULT_PASSWORD = ''; 

    // Browser prompt box ke zariye password maangna
    let password = prompt("Yeh video password protected hai. Kripya video ka password darj karein:", DEFAULT_PASSWORD);

    if (password) {
        // Dailymotion embed URL banaana, jismein password shamil ho
        const embedUrl = `https://www.dailymotion.com/embed/video/${VIDEO_ID}?queue-autoplay-next=false&autoplay=1&password=${encodeURIComponent(password)}`;
        
        console.log("Loading Dailymotion Embed with Password:", embedUrl);
        iframe.src = embedUrl;

    } else {
        // Agar user ne password na diya
        alert("Video play karne ke liye password zaroori hai.");
    }
});
