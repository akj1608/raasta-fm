/**
 * Raasta Radio — raasta.fm
 * Nostalgic Indian highway night music player
 * Playlist loaded from playlist.js
 */

/** Classic truck-back muhawaras — curated highway poetry */
const TRUCK_MUHAWARAS = [
  {
    line: 'बुरी नज़र वाले, तेरा मुँह काला',
    board: ['बुरी नज़र वाले', 'तेरा मुँह काला'],
    truck: ['बुरी नज़र वाले', 'MOOH KALA'],
  },
  {
    line: 'देख मगर प्यार से',
    board: ['देख मगर', 'प्यार से'],
    truck: ['DEKH MAGAR', 'PYAAR SE'],
  },
  {
    line: 'हंस मत पगली, प्यार हो जाएगा',
    board: ['हंस मत पगली', 'प्यार हो जाएगा'],
    truck: ['हंस मत पगली', 'PYAAR HO JAYEGA'],
  },
  {
    line: 'दम है तो पास कर, वरना बर्दाश्त कर',
    board: ['दम है तो पास कर', 'वरना बर्दाश्त कर'],
    truck: ['DUM HAI TOH', 'PASS KAR'],
  },
  {
    line: 'धीरे चलोगे तो बार-बार मिलेंगे, तेज चलोगे तो हरिद्वार मिलेंगे',
    board: ['धीरे चलोगे तो बार-बार मिलेंगे', 'तेज चलोगे तो हरिद्वार मिलेंगे'],
    truck: ['DHEERE CHALOGE', 'HARIDWAR MILENGE'],
  },
  {
    line: 'Use Dipper at Night',
    board: ['रात में डिप्पर लगाओ', 'Use Dipper at Night'],
    truck: ['USE DIPPER', 'AT NIGHT'],
  },
  {
    line: 'मालिक की ज़िंदगी, चमचे का काम — जब तक खाए चना, तब तक रहे नाम',
    board: ['मालिक की ज़िंदगी, चमचे का काम', 'जब तक खाए चना, तब तक रहे नाम'],
    truck: ['MALIK KI ZINDAGI', 'CHAMCHE KA KAAM'],
  },
  {
    line: 'तितली रस चूसती है, भंवरा बदनाम होता है — दुनिया शराब पीती है, ड्राइवर बदनाम होता है',
    board: ['तितली रस चूसती है, भंवरा बदनाम', 'दुनिया शराब पीती है, ड्राइवर बदनाम'],
    truck: ['DUNIYA SHARAAB', 'DRIVER BADNAAM'],
  },
  {
    line: 'कम तेल पी मेरी रानी, महँगा है इराक का पानी',
    board: ['कम तेल पी मेरी रानी', 'महँगा है इराक का पानी'],
    truck: ['KAM TEL PI', 'MERI RANI'],
  },
  {
    line: 'Horn OK Please',
    board: ['Horn OK Please', 'हॉर्न करो, पास करो'],
    truck: ['HORN OK', 'PLEASE'],
  },
  {
    line: 'मेरा भारत महान',
    board: ['मेरा भारत महान', 'जय हिंद'],
    truck: ['MERAA BHARAT', 'MAHAAN'],
  },
];
let player = null;
let currentIndex = 0;
let isPlaying = false;
let isMutedAutoplay = false;
let soundEnabled = false;
let progressInterval = null;
let isDragging = false;
let errorSkips = 0;
let playerReady = false;

const $ = (sel) => document.querySelector(sel);

const els = {
  clock: $('#clock'),
  onlineCount: $('#online-count'),
  roadQuote: $('#road-quote'),
  billboardHindi: $('#billboard-hindi'),
  billboardSub: $('#billboard-sub'),
  truckLineTop: $('#truck-line-top'),
  truckLineMain: $('#truck-line-main'),
  trackTitle: $('#track-title'),
  trackArtist: $('#track-artist'),
  albumArt: $('#album-art'),
  vinyl: $('#vinyl'),
  btnPlay: $('#btn-play'),
  btnPrev: $('#btn-prev'),
  btnNext: $('#btn-next'),
  iconPlay: $('.icon-play'),
  iconPause: $('.icon-pause'),
  progressBar: $('#progress-bar'),
  progressFill: $('#progress-fill'),
  progressThumb: $('#progress-thumb'),
  timeCurrent: $('#time-current'),
  timeTotal: $('#time-total'),
};

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateClock() {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const h = ist.getHours().toString().padStart(2, '0');
  const m = ist.getMinutes().toString().padStart(2, '0');
  els.clock.textContent = `${h}:${m} IST`;
}

function updateOnlineCount() {
  const base = 28 + Math.floor(Math.random() * 25);
  const delta = Math.floor(Math.random() * 7) - 3;
  const current = parseInt(els.onlineCount.textContent, 10) || base;
  const next = Math.max(18, Math.min(72, current + delta));
  els.onlineCount.textContent = next;
}

function getThumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function updateTrackUI(index) {
  const track = PLAYLIST[index];
  els.trackTitle.textContent = track.title;
  els.trackArtist.textContent = track.artist;
  els.albumArt.onerror = () => {
    els.albumArt.onerror = null;
    els.albumArt.src = `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ff9a3c"/><stop offset="100%" stop-color="#ff5500"/></linearGradient></defs><circle cx="60" cy="60" r="60" fill="url(#g)"/><text x="60" y="68" text-anchor="middle" font-size="36">☕</text></svg>`
    )}`;
  };
  els.albumArt.src = getThumbnailUrl(track.id);
  els.albumArt.alt = `${track.title} album art`;
}

function setPlayingState(playing) {
  isPlaying = playing;
  els.vinyl.classList.toggle('spinning', playing);
  els.btnPlay.classList.toggle('is-playing', playing);
  els.btnPlay.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  els.btnPlay.setAttribute('aria-pressed', playing ? 'true' : 'false');
}

function enableSound() {
  if (!player || soundEnabled) return;
  soundEnabled = true;
  isMutedAutoplay = false;
  if (player.unMute) player.unMute();
  if (player.setVolume) player.setVolume(100);
  if (player.getPlayerState && player.getPlayerState() !== YT.PlayerState.PLAYING) {
    player.playVideo();
  }
}

function tryAutoUnmute() {
  if (!player || soundEnabled) return;
  if (player.unMute) player.unMute();
  if (player.setVolume) player.setVolume(100);
  soundEnabled = true;
  isMutedAutoplay = false;
}

function loadTrack(index, shouldPlay = null) {
  const play = shouldPlay !== null ? shouldPlay : isPlaying;
  currentIndex = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
  updateTrackUI(currentIndex);
  errorSkips = 0;

  if (!player || !player.loadVideoById) return;

  const videoId = PLAYLIST[currentIndex].id;
  if (play) {
    player.loadVideoById({ videoId, startSeconds: 5 });
    setTimeout(() => {
      if (!soundEnabled && player.mute) player.mute();
      player.playVideo();
    }, 100);
  } else {
    player.cueVideoById({ videoId, startSeconds: 0 });
    setPlayingState(false);
  }
}

function togglePlay() {
  if (!player || !player.getPlayerState) return;

  enableSound();

  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
    player.pauseVideo();
    setPlayingState(false);
    stopProgressLoop();
  } else {
    setPlayingState(true);
    player.playVideo();
  }
}

function stopProgressLoop() {
  clearInterval(progressInterval);
  progressInterval = null;
}

function startProgressLoop() {
  stopProgressLoop();
  progressInterval = setInterval(updateProgress, 250);
}

function prevTrack() {
  enableSound();
  loadTrack(currentIndex - 1, true);
}

function nextTrack() {
  enableSound();
  loadTrack(currentIndex + 1, true);
}

function updateProgress() {
  if (!player || !player.getCurrentTime) return;
  const current = player.getCurrentTime();
  const total = player.getDuration();
  if (!total || isDragging) return;

  const pct = (current / total) * 100;
  els.progressFill.style.width = `${pct}%`;
  els.progressThumb.style.left = `${pct}%`;
  els.progressBar.setAttribute('aria-valuenow', Math.round(pct));
  els.timeCurrent.textContent = formatTime(current);
  els.timeTotal.textContent = formatTime(total);
}

function seekTo(clientX) {
  const rect = els.progressBar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  const total = player.getDuration();
  if (total) {
    player.seekTo(total * pct, true);
    els.progressFill.style.width = `${pct * 100}%`;
    els.progressThumb.style.left = `${pct * 100}%`;
    els.timeCurrent.textContent = formatTime(total * pct);
  }
}

function setupProgressBar() {
  const startDrag = (e) => {
    isDragging = true;
    els.progressBar.classList.add('dragging');
    seekTo(e.clientX ?? e.touches[0].clientX);
  };

  const moveDrag = (e) => {
    if (!isDragging) return;
    seekTo(e.clientX ?? e.touches[0].clientX);
  };

  const endDrag = () => {
    isDragging = false;
    els.progressBar.classList.remove('dragging');
  };

  els.progressBar.addEventListener('mousedown', startDrag);
  els.progressBar.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('mousemove', moveDrag);
  window.addEventListener('touchmove', moveDrag, { passive: true });
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);

  els.progressBar.addEventListener('keydown', (e) => {
    if (!player) return;
    const total = player.getDuration();
    const current = player.getCurrentTime();
    let seek = current;
    if (e.key === 'ArrowRight') seek = Math.min(total, current + 5);
    else if (e.key === 'ArrowLeft') seek = Math.max(0, current - 5);
    else return;
    e.preventDefault();
    player.seekTo(seek, true);
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    setPlayingState(true);
    startProgressLoop();
    tryAutoUnmute();
  } else if (event.data === YT.PlayerState.PAUSED) {
    setPlayingState(false);
    stopProgressLoop();
  } else if (event.data === YT.PlayerState.BUFFERING) {
    if (isPlaying) els.vinyl.classList.add('spinning');
  } else if (event.data === YT.PlayerState.ENDED) {
    loadTrack(currentIndex + 1, true);
  }
}

let autoplayRetries = 0;

function ensurePlaying() {
  if (!player || !player.getPlayerState) return;

  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
    autoplayRetries = 0;
    return;
  }

  if (autoplayRetries >= 10) return;
  autoplayRetries++;

  if (!soundEnabled && player.mute) {
    isMutedAutoplay = true;
    player.mute();
  }
  player.playVideo();
  setTimeout(ensurePlaying, 400);
}

function attemptAutoplay() {
  if (!player) return;

  setPlayingState(true);
  isMutedAutoplay = true;
  if (player.mute) player.mute();
  player.playVideo();
  ensurePlaying();

  [300, 800, 1500].forEach((delay) => {
    setTimeout(tryAutoUnmute, delay);
  });
}

function onPlayerError() {
  if (errorSkips >= PLAYLIST.length) {
    els.trackTitle.textContent = 'Playback unavailable';
    els.trackArtist.textContent = 'Try again later';
    return;
  }
  errorSkips++;
  nextTrack();
}

function onPlayerReady() {
  playerReady = true;
  attemptAutoplay();
}

function initPlayer() {
  if (player) return;

  currentIndex = Math.floor(Math.random() * PLAYLIST.length);
  updateTrackUI(currentIndex);

  player = new YT.Player('yt-player', {
    height: '1',
    width: '1',
    videoId: PLAYLIST[currentIndex].id,
    playerVars: {
      autoplay: 1,
      mute: 1,
      start: 5,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
      enablejsapi: 1,
      origin: window.location.origin,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
    },
  });
}

window.onYouTubeIframeAPIReady = function () {
  initPlayer();
};

function updateTruckMuhawara() {
  const pick = TRUCK_MUHAWARAS[Math.floor(Math.random() * TRUCK_MUHAWARAS.length)];

  if (els.roadQuote) {
    els.roadQuote.style.opacity = '0';
    setTimeout(() => {
      els.roadQuote.textContent = pick.line;
      els.roadQuote.style.opacity = '1';
    }, 350);
  }

  if (els.billboardHindi && els.billboardSub) {
    els.billboardHindi.textContent = pick.board[0];
    els.billboardSub.textContent = pick.board[1];
  }

  if (els.truckLineTop && els.truckLineMain) {
    els.truckLineTop.textContent = pick.truck[0];
    els.truckLineMain.textContent = pick.truck[1];
  }
}

function init() {
  if (!Array.isArray(PLAYLIST) || !PLAYLIST.length) {
    els.trackTitle.textContent = 'Playlist unavailable';
    els.trackArtist.textContent = 'Reload the page';
    return;
  }

  updateClock();
  setInterval(updateClock, 10000);
  updateOnlineCount();
  setInterval(updateOnlineCount, 8000 + Math.random() * 7000);
  updateTruckMuhawara();
  setInterval(updateTruckMuhawara, 14000);

  els.btnPlay.addEventListener('click', togglePlay);
  els.btnPrev.addEventListener('click', prevTrack);
  els.btnNext.addEventListener('click', nextTrack);

  setupProgressBar();

  if (typeof YT !== 'undefined' && YT.Player) {
    initPlayer();
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.code === 'ArrowRight' && e.shiftKey) {
      nextTrack();
    } else if (e.code === 'ArrowLeft' && e.shiftKey) {
      prevTrack();
    }
  });

  setTimeout(() => {
    if (!window.YT) {
      els.trackTitle.textContent = 'Player unavailable';
      els.trackArtist.textContent = 'Check your connection and reload';
    }
  }, 8000);
}

init();
