const playlist = [
    { title: "Kisah Klasik", artist: "Sheila On 7", src: "lagu1.mp3" },
    { title: "Tujuh Belas", artist: "Tulus", src: "lagu2.mp3" },
    { title: "Anak Sekolah", artist: "Chrisye", src: "lagu3.mp3" }
];

let currentTrack = 0;
const audio = document.getElementById('audioPlayer');

function toggleMusicModal() {
    const modal = document.getElementById('musicModal');
    modal.classList.toggle('show');
}

function playTrack(index) {
    currentTrack = index;
    audio.src = playlist[index].src;
    document.getElementById('currentTitle').innerText = playlist[index].title;
    document.getElementById('currentArtist').innerText = playlist[index].artist;
    
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, i) => {
        if(i === index) item.classList.add('active');
        else item.classList.remove('active');
    });

    audio.play();
    document.getElementById('mainPlayBtn').innerText = '❚❚';
}

function playPauseAudio() {
    if (audio.paused) {
        audio.play();
        document.getElementById('mainPlayBtn').innerText = '❚❚';
    } else {
        audio.pause();
        document.getElementById('mainPlayBtn').innerText = '▶';
    }
}

function nextSong() {
    currentTrack = (currentTrack + 1) % playlist.length;
    playTrack(currentTrack);
}

function prevSong() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    playTrack(currentTrack);
}
