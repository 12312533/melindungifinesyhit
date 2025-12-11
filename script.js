document.addEventListener('DOMContentLoaded', function() {
    // --- AMBIL ELEMEN DARI DOM ---
    const rescueButton = document.getElementById('rescue-button');
    const initialScene = document.getElementById('initialScene');
    const rescueScene = document.getElementById('rescueScene');
    const victoryScene = document.getElementById('victoryScene');
    const failureScene = document.getElementById('failureScene');
    const badMoodBubble = document.getElementById('bad-mood-bubble');
    const badMoodTarget = document.getElementById('bad-mood-target');
    const rescuerPunch = document.getElementById('rescuer-punch');
    const badMoodBurst = document.getElementById('bad-mood-burst');
    const backgroundMusic = document.getElementById('background-music');
    const retryButton = document.getElementById('retry-button');
    const finalButton = document.getElementById('final-button');

    // --- ELEMENT GALERI ---
    const poseImages = document.querySelectorAll('#coolPosesGallery .pose-image');
    let currentPoseIndex = 0;

    // --- KONSTANTA TIMING ---
    const failureTimeoutDuration = 5000; 
    const musicAndPunchDuration = 3000; 
    const transitionDuration = 2000; 
    const punchEnterDuration = 50; 
    let failureTimer;

    // --- FUNGSI GALERI TRANSISI EPIC ---
    function startGalleryTransition() {
        // Reset Galeri ke Foto 1
        poseImages.forEach((img, index) => {
            img.classList.remove('active');
            if (index === 0) img.classList.add('active');
        });
        
        currentPoseIndex = 0;
        
        function nextImage() {
            poseImages[currentPoseIndex].classList.remove('active');
            currentPoseIndex = (currentPoseIndex + 1);
            
            if (currentPoseIndex >= poseImages.length) {
                return; 
            }
            
            poseImages[currentPoseIndex].classList.add('active');
        }

        // Transisi 1 ke 2 (setelah 2 detik)
        setTimeout(() => nextImage(), transitionDuration);
        
        // Transisi 2 ke 3 (setelah 4 detik dari awal)
        setTimeout(() => nextImage(), transitionDuration * 2);
        
        // Hentikan musik dan tampilkan tombol selesai (Total 6 detik)
        const totalGalleryTime = transitionDuration * poseImages.length; 
        setTimeout(() => {
            backgroundMusic.pause(); // KUNCI: Hentikan musik setelah transisi
            backgroundMusic.currentTime = 0;
            finalButton.classList.remove('hidden');
        }, totalGalleryTime); 
    }


    // --- LOGIKA TIMER KEGAGALAN ---
    function startFailureTimer() {
        clearTimeout(failureTimer);
        
        badMoodBubble.classList.remove('hidden');
        badMoodBubble.style.animation = 'moveBadMood 5s linear forwards';
        
        failureTimer = setTimeout(() => {
            // Aksi saat GAGAL
            initialScene.classList.add('hidden');
            badMoodBubble.classList.add('hidden');
            failureScene.classList.remove('hidden');
        }, failureTimeoutDuration);
    }
    
    startFailureTimer();

    
    // --- EVENT: TOMBOL SELAMATKAN DIKLIK (MISI SUKSES) ---
    rescueButton.addEventListener('click', function() {
        clearTimeout(failureTimer); 
        
        // KUNCI PENTING: Play Music secara langsung saat klik
        backgroundMusic.currentTime = 0; 
        backgroundMusic.play().catch(error => {
            // Ini akan muncul jika browser memblokir autoplay
            console.warn("Autoplay diblokir:", error);
            alert("Musik diblokir oleh browser. Pastikan file audio ada dan klik tombol play/unmute di browser jika muncul.");
        }); 
        
        // 1. Pindah ke Rescue Scene
        initialScene.classList.add('hidden');
        badMoodBubble.style.animation = 'none'; 
        badMoodBubble.classList.add('hidden');
        rescueScene.classList.remove('hidden');
        badMoodTarget.classList.remove('hidden');
        
        // 2. PICU KEDATANGAN TIBA-TIBA COWOK
        rescuerPunch.classList.remove('hidden');
        rescuerPunch.style.animation = 'none'; 
        rescuerPunch.style.right = '-300px'; 
        rescuerPunch.style.opacity = '0'; 
        
        setTimeout(() => {
            rescuerPunch.style.animation = `rescuerEnterPunch 0.5s ease-out forwards`; 
            badMoodTarget.style.animation = 'shakeAttack 0.1s infinite'; 
        }, 50); 
        

        // 3. Jeda 3 detik untuk momen menangkis, lalu ledakan
        setTimeout(() => {
            badMoodTarget.style.animation = 'none'; // Stop Shake

            // Ledakan (0.7 detik)
            badMoodBurst.classList.remove('hidden');
            badMoodBurst.style.animation = 'burstEffect 0.7s forwards'; 
            badMoodTarget.classList.add('hidden'); 
            
            // 4. Pindah ke Victory Scene dan mulai Galeri
            setTimeout(function() {
                rescueScene.classList.add('hidden');
                victoryScene.classList.remove('hidden');
                
                // MULAI GALERI TRANSISI (MUSIK MASIH BERLANJUT SELAMA 6 DETIK!)
                startGalleryTransition(); 

            }, 700); 

        }, musicAndPunchDuration); // Jeda 3 detik
    });
    
    // --- EVENT: TOMBOL COBA LAGI (RETRY) ---
    retryButton.addEventListener('click', function() {
        failureScene.classList.add('hidden');
        initialScene.classList.remove('hidden');
        victoryScene.classList.add('hidden');
        finalButton.classList.add('hidden');
        
        // Reset Galeri ke Foto 1
        poseImages.forEach((img, index) => {
            img.classList.remove('active');
            if (index === 0) img.classList.add('active');
        });
        
        badMoodTarget.classList.add('hidden');
        rescuerPunch.style.animation = 'none';
        rescuerPunch.classList.add('hidden');
        
        startFailureTimer();
    });

    // Opsional: Tombol Selesai (Final)
    finalButton.addEventListener('click', function() {
        alert("Misi Selesai! Mas Sayang berhasil menghancurkan Bad Mood! Kini siap untuk disayang-sayang.");
    });

});