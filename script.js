document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const lightThemeStylesheet = document.getElementById('lightThemeStylesheet');
    const terminalIcon = document.getElementById('terminalIcon');
    const body = document.body;

    const ICONS = {
        dark: 'assets/images/blair-icon-red.png',
        'light-yellow.css': 'assets/images/blair-icon-black.png',
        'light-cyan.css': 'assets/images/blair-icon-original.png'
    };

    function updateThemeIcons(isLight, activeFile) {
        if (!terminalIcon) return;
        if (isLight) {
            terminalIcon.src = ICONS[activeFile] || ICONS['light-yellow.css'];
        } else {
            terminalIcon.src = ICONS.dark;
        }
    }

    
// ==========================================
    // 3-YEAR REGRESSIVE COUNTDOWN LOGIC
    // ==========================================
    const countdownTimerDisplay = document.getElementById('countdownTimer');
    const countdownTimerMobileDisplay = document.getElementById('countdownTimerMobile');
    
    let targetTime = localStorage.getItem('licenseTargetTime');
    if (!targetTime) {
        // 3 years from now in milliseconds
        targetTime = new Date().getTime() + (3 * 365.25 * 24 * 60 * 60 * 1000);
        localStorage.setItem('licenseTargetTime', targetTime);
    }

    function updateCountdown() {
        const now = new Date().getTime();
        let distance = targetTime - now;

        if (distance < 0) {
            distance = 0;
        }

        const years = Math.floor(distance / (1000 * 60 * 60 * 24 * 365.25));
        const days = Math.floor((distance % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const formattedTime = `${years}y ${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (countdownTimerDisplay) countdownTimerDisplay.textContent = formattedTime;
        if (countdownTimerMobileDisplay) countdownTimerMobileDisplay.textContent = formattedTime;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
    

    function getWaveformColorsFromCSS() {
        const computed = getComputedStyle(document.documentElement);
        return {
            waveColor: computed.getPropertyValue('--wave-unplayed').trim() || '#2b5838',
            progressColor: computed.getPropertyValue('--wave-played').trim() || '#e3f5ee',
            cursorColor: computed.getPropertyValue('--wave-cursor').trim() || '#e3f5ee'
        };
    }

    function updateToggleIcon() {
        themeToggle.textContent = body.classList.contains('light') ? '☽' : '☼';
    }

    const savedTheme = localStorage.getItem('theme');
    const savedLightFile = localStorage.getItem('themeFile') || window.ACTIVE_LIGHT_THEME || 'light-yellow.css';

    if (savedTheme === 'light') {
        body.classList.add('light');
        if (lightThemeStylesheet) {
            lightThemeStylesheet.href = savedLightFile;
            lightThemeStylesheet.removeAttribute('disabled');
        }
        updateThemeIcons(true, savedLightFile);
    } else {
        updateThemeIcons(false);
    }
    updateToggleIcon();

    themeToggle.addEventListener('click', () => {
        const isLight = body.classList.toggle('light');
        const activeFile = window.ACTIVE_LIGHT_THEME || 'light-yellow.css';
        
        if (isLight) {
            if (lightThemeStylesheet) {
                lightThemeStylesheet.href = activeFile;
                lightThemeStylesheet.removeAttribute('disabled');
            }
            localStorage.setItem('themeFile', activeFile);
            localStorage.setItem('theme', 'light');
            updateThemeIcons(true, activeFile);
        } else {
            if (lightThemeStylesheet) {
                lightThemeStylesheet.setAttribute('disabled', 'true');
                lightThemeStylesheet.href = '';
            }
            localStorage.setItem('theme', 'dark');
            updateThemeIcons(false);
        }

        updateToggleIcon();
        
        if (wavesurfer) {
            const colors = getWaveformColorsFromCSS();
            wavesurfer.setOptions({
                waveColor: colors.waveColor,
                progressColor: colors.progressColor,
                cursorColor: colors.cursorColor
            });
        }
    });

    const SUPABASE_URL = 'https://lxumyzkjekyqetqlmimc.supabase.co'; 
    const SUPABASE_ANON_KEY = 'sb_publishable_TsyDxsLUQCpIWVzZXKjM5w_7GzCPmKh';
    
    let supabaseClient = null;
    try {
        if (window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }
    } catch (e) {
        console.error("Error initializing Supabase client:", e);
    }

    const categories = [
        {
            title: "$ ep_singles",
            sectionImage: "assets/audio/ep-singles/single1/cover.jpg", 
            tracks: [
                { id: "s1", name: "raw_cut_01", src: "assets/audio/ep-singles/single1/track2.wav", cover: "assets/images/covers/grillz/cover2.jpg", youtube: "https://youtube.com/your-video-1", likes: 14 },
                { id: "s2", name: "midnight_freq", src: "assets/audio/ep-singles/single2/track2.wav", cover: "assets/images/covers/track1/cover1.jpg", youtube: "", likes: 28 }
            ]
        },
        {
            title: "$ covers_project",
            sectionImage: "assets/audio/ep-singles/single3/cover.jpg", 
            tracks: [
                { id: "c1", name: "sub_zero_session", src: "assets/audio/ep-singles/single3/track3.wav", cover: "assets/images/covers/single3/cover.jpg", youtube: "https://youtube.com/your-video-3", likes: 9 },
                { id: "c2", name: "terminal_state", src: "assets/audio/ep-singles/single4/track4.wav", cover: "assets/images/covers/single4/cover.jpg", youtube: "", likes: 19 }
            ]
        }
    ];

    const catalogContainer = document.getElementById('catalogContainer');
    if (catalogContainer) {
        catalogContainer.innerHTML = categories.map((cat, catIdx) => `
            <div class="category-header-box">
                <img src="${cat.sectionImage}" alt="Section Cover" class="category-banner-thumb">
                <h2>${cat.title}</h2>
            </div>
            <div class="audio-grid">
                ${cat.tracks.map((track, trackIdx) => {
                    let globalIdx = 0;
                    for(let i=0; i<catIdx; i++) globalIdx += categories[i].tracks.length;
                    globalIdx += trackIdx;

                    return `
                        <button id="track_card_${globalIdx}" onclick="playTrack(${globalIdx})">
                            <div class="track-btn-info">
                                <img class="btn-thumb" src="${track.cover}" alt="c"> 
                                <span>${track.name}</span>
                            </div>
                            <span class="track-btn-likes" id="grid_likes_${track.id}">♥ ${track.likes}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `).join('');
    }

    const allTracks = categories.flatMap(cat => cat.tracks);

    async function syncCloudLikes() {
        if (!supabaseClient) return;
        try {
            const { data, error } = await supabaseClient.from('track_likes').select('*');
            if (data && !error) {
                data.forEach(row => {
                    const found = allTracks.find(t => t.id === row.track_id);
                    if (found && row.likes_count !== null) {
                        found.likes = row.likes_count;
                        const badge = document.getElementById(`grid_likes_${found.id}`);
                        if (badge) badge.textContent = `♥ ${found.likes}`;
                    }
                });
            }
        } catch (e) {
            console.log("Error syncing cloud likes:", e);
        }
    }
    syncCloudLikes();

    const nowPlaying = document.getElementById('nowPlaying');
    const activeCover = document.getElementById('activeCover');
    const playerDisplay = document.getElementById('playerDisplay');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const durationDisplay = document.getElementById('durationDisplay');
    const trackTitleDisplay = document.getElementById('trackTitleDisplay');
    const pauseBtn = document.getElementById('pauseBtn');
    const youtubeLinkContainer = document.getElementById('youtubeLinkContainer');
    const youtubeLink = document.getElementById('youtubeLink');
    const likeCountDisplay = document.getElementById('likeCountDisplay');
    const likeIconSvg = document.getElementById('likeIconSvg');
    const commentInput = document.getElementById('commentInput');
    const commentsList = document.getElementById('commentsList');
    const speedVal = document.getElementById('speedVal');

    let wavesurfer = null;
    let currentSpeed = 1.0;
    let currentTrackIndex = 0;
    let currentTrack = null;

    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }

    function updateActiveCardVisuals(playingIndex, isPlaying) {
        allTracks.forEach((_, idx) => {
            const btn = document.getElementById(`track_card_${idx}`);
            if (btn) btn.classList.remove('is-playing-card');
        });

        if (isPlaying && playingIndex !== null && playingIndex !== undefined) {
            const activeBtn = document.getElementById(`track_card_${playingIndex}`);
            if (activeBtn) activeBtn.classList.add('is-playing-card');
        }
    }

    async function loadCloudComments(trackId) {
        if (!commentsList) return;
        if (!supabaseClient) {
            commentsList.innerHTML = '<div style="font-size: 0.75em; opacity: 0.6;">Supabase client not initialized.</div>';
            return;
        }

        commentsList.innerHTML = '<div style="font-size: 0.75em; opacity: 0.5;">Loading comments from cloud...</div>';
        
        try {
            const { data, error } = await supabaseClient
                .from('track_comments')
                .select('*')
                .eq('track_id', trackId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (!data || data.length === 0) {
                commentsList.innerHTML = '<div style="font-size: 0.75em; opacity: 0.5;">No comments yet. Be the first!</div>';
                return;
            }

            commentsList.innerHTML = data.map(c => `
                <div class="comment-item">
                    <span class="comment-time">[${c.timestamp || '00:00'}]</span>
                    <span class="comment-text">${c.text}</span>
                </div>
            `).join('');
        } catch (err) {
            commentsList.innerHTML = '<div style="font-size: 0.75em; color: #ff5f56;">Error loading cloud comments.</div>';
        }
    }

    window.playTrack = function(index) {
        currentTrackIndex = index;
        currentTrack = allTracks[index];
        if (currentTrack) {
            nowPlaying.textContent = '▶ Playing: ' + currentTrack.name;
            if (trackTitleDisplay) trackTitleDisplay.textContent = currentTrack.name;
            if (likeCountDisplay) likeCountDisplay.textContent = currentTrack.likes;
            
            if (likeIconSvg) {
                const userLikedKey = `liked_${currentTrack.id}`;
                if (localStorage.getItem(userLikedKey) === 'true') {
                    likeIconSvg.style.color = '#ff5f56';
                } else {
                    likeIconSvg.style.color = 'inherit';
                }
            }

            if (playerDisplay) playerDisplay.classList.remove('hidden');

            if (youtubeLinkContainer) {
                if (currentTrack.youtube && currentTrack.youtube.trim() !== "") {
                    youtubeLinkContainer.classList.remove('hidden');
                    if (youtubeLink) youtubeLink.href = currentTrack.youtube;
                } else {
                    youtubeLinkContainer.classList.add('hidden');
                }
            }

            if (pauseBtn) pauseBtn.textContent = "⏸ PAUSE";
            loadCloudComments(currentTrack.id);

            const colors = getWaveformColorsFromCSS();

            if (!wavesurfer) {
                wavesurfer = WaveSurfer.create({
                    container: '#waveform',
                    waveColor: colors.waveColor,
                    progressColor: colors.progressColor,
                    cursorColor: colors.cursorColor,
                    barWidth: 2,
                    barGap: 2,
                    barRadius: 2,
                    height: 45,
                    responsive: true
                });

                wavesurfer.on('timeupdate', (currentTime) => {
                    if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(currentTime);
                });

                wavesurfer.on('ready', () => {
                    if (durationDisplay) durationDisplay.textContent = formatTime(wavesurfer.getDuration());
                });

                wavesurfer.on('play', () => {
                    updateActiveCardVisuals(currentTrackIndex, true);
                });

                wavesurfer.on('pause', () => {
                    updateActiveCardVisuals(currentTrackIndex, false);
                });

                wavesurfer.on('finish', () => {
                    if (pauseBtn) pauseBtn.textContent = "▶ RESUME";
                    nowPlaying.textContent = '❚❚ Paused: ' + currentTrack.name;
                    updateActiveCardVisuals(currentTrackIndex, false);
                });
            } else {
                wavesurfer.setOptions({
                    waveColor: colors.waveColor,
                    progressColor: colors.progressColor,
                    cursorColor: colors.cursorColor
                });
            }

            wavesurfer.load(currentTrack.src);
            wavesurfer.once('ready', () => {
                wavesurfer.setPlaybackRate(currentSpeed);
                wavesurfer.play();
                updateActiveCardVisuals(currentTrackIndex, true);
            });

            if (currentTrack.cover && activeCover) activeCover.src = currentTrack.cover;
        }
    };

    window.togglePause = function() {
        if (wavesurfer) {
            if (wavesurfer.isPlaying()) {
                wavesurfer.pause();
                if (pauseBtn) pauseBtn.textContent = "▶ RESUME";
                nowPlaying.textContent = '❚❚ Paused: ' + currentTrack.name;
                updateActiveCardVisuals(currentTrackIndex, false);
            } else {
                wavesurfer.play();
                if (pauseBtn) pauseBtn.textContent = "⏸ PAUSE";
                nowPlaying.textContent = '▶ Playing: ' + currentTrack.name;
                updateActiveCardVisuals(currentTrackIndex, true);
            }
        }
    };

    window.closePlayer = function() {
        if (wavesurfer) wavesurfer.stop();
        if (playerDisplay) playerDisplay.classList.add('hidden');
        if (youtubeLinkContainer) youtubeLinkContainer.classList.add('hidden');
        updateActiveCardVisuals(null, false);
        nowPlaying.textContent = '▶ load frequency... select a track fragment';
    };

    window.changeSpeedSlider = function(val) {
        currentSpeed = parseFloat(val);
        if (speedVal) speedVal.textContent = `${val}x`;
        if (wavesurfer) wavesurfer.setPlaybackRate(currentSpeed);
    };

    window.likeTrack = async function() {
        if (!currentTrack) return;

        const userLikedKey = `liked_${currentTrack.id}`;
        if (localStorage.getItem(userLikedKey) === 'true') {
            return;
        }

        currentTrack.likes++;
        if (likeCountDisplay) likeCountDisplay.textContent = currentTrack.likes;

        const badge = document.getElementById(`grid_likes_${currentTrack.id}`);
        if (badge) badge.textContent = `♥ ${currentTrack.likes}`;

        if (likeIconSvg) {
            likeIconSvg.style.color = '#ff5f56';
        }

        localStorage.setItem(userLikedKey, 'true');

        if (supabaseClient) {
            await supabaseClient
                .from('track_likes')
                .upsert({ track_id: currentTrack.id, likes_count: currentTrack.likes }, { onConflict: 'track_id' });
        }
    };

    window.postComment = async function() {
        if (!commentInput || !wavesurfer || !currentTrack) return;
        const text = commentInput.value.trim();
        if (!text) return;

        if (!supabaseClient) {
            alert("Supabase client not initialized.");
            return;
        }

        const storageKey = `comments_count_${currentTrack.id}`;
        let userCommentCount = parseInt(localStorage.getItem(storageKey) || '0', 10);

        if (userCommentCount >= 3) {
            alert("Limit reached: You can only post a maximum of 3 comments per track.");
            return;
        }

        const currentTimeSecs = wavesurfer.getCurrentTime();
        const formattedTimestamp = formatTime(currentTimeSecs);

        commentInput.value = "";
        
        try {
            const { error } = await supabaseClient
                .from('track_comments')
                .insert([{ 
                    track_id: currentTrack.id, 
                    timestamp: formattedTimestamp, 
                    text: text 
                }]);

            if (error) throw error;

            userCommentCount++;
            localStorage.setItem(storageKey, userCommentCount);

            loadCloudComments(currentTrack.id);
        } catch (err) {
            alert("Failed to post comment to cloud: " + err.message);
        }
    };

    window.copyTrackLink = function() {
        navigator.clipboard.writeText(window.location.href);
        alert('Track link copied to clipboard!');
    };

    window.shareTrack = function() {
        if (navigator.share) {
            navigator.share({
                title: currentTrack ? currentTrack.name : 'Track',
                text: 'Check out this track on dfkb // sound terminal',
                url: window.location.href,
            }).catch(() => {});
        } else {
            copyTrackLink();
        }
    };

    document.addEventListener('keydown', (e) => {
        if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

        if (e.code === 'Space') {
            e.preventDefault();
            if (currentTrack) togglePause();
        } else if (e.code === 'ArrowRight') {
            e.preventDefault();
            if (wavesurfer && wavesurfer.isPlaying()) {
                wavesurfer.skip(5);
            }
        } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            if (wavesurfer && wavesurfer.isPlaying()) {
                wavesurfer.skip(-5);
            }
        } else if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            if (wavesurfer) {
                const isMuted = wavesurfer.isMuted();
                wavesurfer.setMuted(!isMuted);
            }
        }
    });
});