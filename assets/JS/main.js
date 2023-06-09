const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicSinger = wrapper.querySelector(".song-details .singer"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    nextBtn = wrapper.querySelector("#next"),
    prevBtn = wrapper.querySelector("#prev"),
    repeatBtn = wrapper.querySelector("#repeat-list"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = wrapper.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more_music"),
    hideMusicBtn = musicList.querySelector("#close"),
    ulTag = wrapper.querySelector("ul"),
    volumeRange = wrapper.querySelector("#volume-range"),
    volumeIcon = wrapper.querySelector("#volume-icon");

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
isMusicPaused = true;
window.addEventListener("load", () => {
    loadMusic(musicIndex);
});
// render music and name, img , singer
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicSinger.innerText = allMusic[indexNumb - 1].singer;
    musicImg.src = `/assets/img/${allMusic[indexNumb - 1].src}.jpg`;
    mainAudio.src = `/assets/music/${allMusic[indexNumb - 1].src}.mp3`;
}

// play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}
// next music function
function nextMusic() {
    musicIndex++; //Khi nhấn vào nút next thì bài hát sẽ tăng lên 1
    // Nếu chỉ múc của bài hát hiện tại mà lớn độ dài của tổng bài hát thì sẽ trả lại
    // bài hát đầu tiên còn nếu không sẽ gán giá trị hiện tại của bài hát đó
    musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
    loadMusic(musicIndex);
    playMusic();
}
// prev music function
function prevMusic() {
    musicIndex--; //Khi nhấn vào nút prev thì bài hát sẽ giảm xuống 1
    musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
    loadMusic(musicIndex);
    playMusic();
}
// bắt sự kiện click vào nút next
nextBtn.addEventListener("click", () => {
    nextMusic();
});
// bắt sự kiện click vào nút prev
prevBtn.addEventListener("click", () => {
    prevMusic();
});
// bắt sự kiện click vào nút paused
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    // Neu isMusicPaused la true thi goi thang pauseMusic() con neu nguoc lai thi goi thang playMusic
    isMusicPaused ? pauseMusic() : playMusic();
});
// Cập nhật độ dài của thanh bar theo giời gian hiện tại của bài hát
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    // công thức tính phần trăm của thời gian lấy thời gian hiện tại chia cho thời gian tổng
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    mainAudio.addEventListener("loadeddata", () => {
        // cập nhật tổng thời gian bài hát
        let musicDuration = wrapper.querySelector(".max-duration");
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
    // cập nhật thời gian bài hát hiện tại
    let musicCurrentTime = wrapper.querySelector(".current-time");
    let currentTimeMin = Math.floor(currentTime / 60);
    let currentTimeSec = Math.floor(currentTime % 60);
    if (currentTimeSec < 10) {
        currentTimeSec = `0${currentTimeSec}`;
    }
    musicCurrentTime.innerText = `${currentTimeMin}:${currentTimeSec}`;
});

// cập nhật thời gian hiện tại của bài hát khi mình click vào chiều rộng của thanh
// progress Bar
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth; // lấy tổng độ dài của thanh progressArea
    let clickedOffsetX = e.offsetX; // lấy giá trị chiều ngang của thanh ghi được click vào vị trí đó
    let songDuration = mainAudio.duration;
    // tính giá trị của thời gian hiện tại mà khi click vào thanh thì ta tính
    // lấy cái giá trị click vào chia cho tổng của cái thanh nhân cho tổng thời gian của
    // bài hát
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();
});

// Thay đổi lặp bài hát, ngầu nhiên, khi nhấn vào icon
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

// Sau khi kết thúc bài hát
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randMusic = Math.floor(Math.random() * allMusic.length + 1);
            // Điều kiện nếu bài hát hiện tại mà bằng bài hát random thì sẽ lặp lại
            do {
                randMusic = Math.floor(Math.random() * allMusic.length + 1);
            } while (musicIndex == randMusic);

            musicIndex = randMusic;
            loadMusic(musicIndex);
            playMusic();
            break;
    }
});
//  Control volume
volumeRange.addEventListener("input", function () {
    var volume = volumeRange.value;
    // Thay đổi màu sắc của thanh điều chỉnh
    volumeRange.style.background =
        "linear-gradient(to right, #ff74a4 0%, #9f6ea3 " +
        volume +
        "%, #ccc " +
        volume +
        "%, #ccc 100%)";

    // Thay đổi biểu tượng theo mức âm lượng
    if (volume == 0) {
        volumeIcon.style.backgroundImage = "url(/assets/icon/volume_off.svg)";
    } else {
        volumeIcon.style.backgroundImage = "url(/assets/icon/volume_up.svg)";
    }
});

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index = "${i + 1}">
    <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].singer}</p>
    </div>
    <audio class="${allMusic[i].src}" src="/assets/music/${
        allMusic[i].src
    }.mp3"></audio>
    <span id = "${allMusic[i].src}"class="audio-duration">3:40</span>
</li>`;
    //Phương insertAdjacentHTML()thức chèn mã HTML vào một vị trí được chỉ định.
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
    liAudioTag.addEventListener("loadeddata", () => {
        // cập nhật tổng thời gian bài hát
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
    });
}

// hàm phát bài hát cụ thể khi click vào thẻ li trong danh sách
function playingSong() {
    const allLiTag = ul.querySelector("li");
    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector(".audio-duration");
        console.log(audioTag);
    }
}
