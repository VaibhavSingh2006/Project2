// Songs list
const songs = [
  { name: "Happy 1", file: "music/happy/ha1.mp3" },
  { name: "Happy 2", file: "music/happy/ha2.mp3" },
  { name: "Angry 1", file: "music/angry/an1.mp3" },
  { name: "Angry 2", file: "music/angry/an2.mp3" },
  { name: "Sad 1", file: "music/sad/sa1.mp3" },
  { name: "Sad 2", file: "music/sad/sa2.mp3" },
  { name: "neutral 1", file: "music/neutral/n1.mp3" },
  { name: "neutral 2", file: "music/neutral/n2.mp3" }
];

let currentSongIndex = 0;
let isPlaying = false;

// DOM elements
const audio = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressBar = document.querySelector('.progress-bar');
const currentTimeElem = document.querySelector('.curr-time');
const totalTimeElem = document.querySelector('.total-time');
const songTitleElem = document.getElementById('songTitle'); // Optional: show song name

// Load song
function loadSong(index) {
  currentSongIndex = index;
  const song = songs[index];
  audio.src = song.file;
  audio.load();
  isPlaying = false;
  playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  currentTimeElem.textContent = '0:00';
  totalTimeElem.textContent = '0:00';
  progressBar.value = 0;

  // Optional: show song title
  if (songTitleElem) {
    songTitleElem.textContent = song.name;
  }
}

// Play
function playSong() {
  audio.play();
  isPlaying = true;
  playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

// Pause
function pauseSong() {
  audio.pause();
  isPlaying = false;
  playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

// Toggle play/pause
playPauseBtn.addEventListener('click', () => {
  isPlaying ? pauseSong() : playSong();
});

// Previous
prevBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

// Next
nextBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

// Time update & progress bar
audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.value = percent;

    const formatTime = (time) => {
      const mins = Math.floor(time / 60);
      let secs = Math.floor(time % 60);
      if (secs < 10) secs = "0" + secs;
      return `${mins}:${secs}`;
    };

    currentTimeElem.textContent = formatTime(audio.currentTime);
    totalTimeElem.textContent = formatTime(audio.duration);
  }
});

// Seek
progressBar.addEventListener('input', () => {
  if (audio.duration) {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
  }
});

// Auto-next on end
audio.addEventListener('ended', () => {
  nextBtn.click();
});

// Init
loadSong(currentSongIndex);






const faceToggle = document.getElementById('faceToggle');
const webcamContainer = document.getElementById('webcam-container');
const webcamVideo = document.getElementById('webcam');

let webcamStream = null;

faceToggle.addEventListener('change', async () => {
  if (faceToggle.checked) {
    webcamContainer.classList.add('active');

    try {
      webcamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      webcamVideo.srcObject = webcamStream;
    } catch (err) {
      alert('Could not access webcam: ' + err);
      faceToggle.checked = false;
      webcamContainer.classList.remove('active');
    }
  } else {
    webcamContainer.classList.remove('active');

    // Stop webcam stream if running
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      webcamStream = null;
      webcamVideo.srcObject = null;
    }

    // Delay hiding the webcamContainer to allow opacity transition
    setTimeout(() => {
      webcamContainer.style.display = 'none';
    }, 400);
  }

  // Always make sure it's displayed (opacity will control visibility)
  webcamContainer.style.display = 'block';
});





const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

function captureAndSendFrame() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append('image', blob, 'frame.jpg');

    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('Detected emotion:', data.emotion);

    // 🎵 Play song based on emotion
    playSong(data.emotion);
  }, 'image/jpeg');
}

// Call every 5 seconds
setInterval(captureAndSendFrame, 5000);

function playSong(emotion) {
  const audio = new Audio();

  switch (emotion) {
    case 'happy':
      audio.src = 'songs/happy.mp3';
      break;
    case 'sad':
      audio.src = 'songs/sad.mp3';
      break;
    case 'angry':
      audio.src = 'songs/angry.mp3';
      break;
    // Add more cases as needed
    default:
      console.log("No valid emotion detected");
      return;
  }

  audio.play();
}


