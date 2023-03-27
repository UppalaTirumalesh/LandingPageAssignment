const playPauseBtn = document.querySelector(".play-pause-btn");
const fullScreenBtn = document.querySelector(".full-screen-btn");
const muteBtn = document.querySelector(".mute-btn");
const volumeSlider = document.querySelector(".volume-slider");
const currentTimeElement = document.querySelector(".current-time");
const totalTimeElement = document.querySelector(".total-time");
const progress = document.querySelector(".progress");
const videoContainer = document.querySelector(".video-container");
const video = document.querySelector("video");

var tabArrows = document.querySelectorAll(".productarrow");
var tabs = document.querySelectorAll(".productTabs__tabs");
var tabContent = document.querySelectorAll(".productStylesGrid");




/* carousel */
const carouselContainer = document.querySelector('.carousel-container');
const carousel = carouselContainer.querySelector('.carousel');
const carouselItems = carouselContainer.querySelectorAll('.carousel-item');
const carouselPrevBtn = carouselContainer.querySelector('.prev-btn');
const carouselNextBtn = carouselContainer.querySelector('.next-btn');


let slideWidth = carouselItems[0].clientWidth;


window.addEventListener('resize', () => {
    slideWidth = carouselItems[0].clientWidth;
})


let currentIndex = 0;
const firstSlideClone = carouselItems[0].cloneNode(true);
const secondSlideClone = carouselItems[1].cloneNode(true);
// console.log(firstSlideClone);
// const lastBeforeSlideClone = carouselItems[carouselItems.length - 2].cloneNode(true);
const lastSlideClone = carouselItems[carouselItems.length - 1].cloneNode(true);

carousel.appendChild(firstSlideClone);
carousel.appendChild(secondSlideClone);

carousel.insertBefore(lastSlideClone, carouselItems[0]);
// carousel.insertBefore(lastBeforeSlideClone, lastSlideClone);


carousel.style.transform = `translateX(-${slideWidth }px)`;
const maxIndex = carouselItems.length - 1;

function slideToNextImage() {
    currentIndex++;
    console.log(currentIndex);
    carousel.style.transition = "all .5s ease";
    carousel.style.transform = `translateX(-${slideWidth *  (currentIndex  + 1 )}px)`;
}

function slideToPreviousImage() {
    currentIndex--;
    console.log(currentIndex);
    carousel.style.transition = "all .5s ease";
    carousel.style.transform = `translateX(-${slideWidth * (currentIndex + 1)}px)`;
}

function handleTransitionEnd() {
    if (currentIndex === carouselItems.length) {
        currentIndex = 0;
        carousel.style.transition = "none";
        carousel.style.transform = `translateX(-${slideWidth }px)`;
    } else if (currentIndex === -1) {
        currentIndex = carouselItems.length - 1;
        carousel.style.transition = "none";
        carousel.style.transform = `translateX(-${slideWidth * (currentIndex + 1)}px)`;
    }
}

function throttle(cb, delay) {
    let wait = false;
    return (...args) => {
        if (wait) {
            return;
        }
        cb(...args);
        wait = true;
        setTimeout(() => {
            wait = false;
        }, delay);
    }
}

carousel.addEventListener("transitionend", handleTransitionEnd);


carouselPrevBtn.addEventListener('click', throttle(() => {
    slideToPreviousImage()
}, 200));

carouselNextBtn.addEventListener('click', throttle(() => {
    slideToNextImage()
}, 200));












for (let tab of tabs) {
  tab.addEventListener("click", gridFunction);
}

function gridFunction(e) {
  for (let tab of tabContent) {
    tab.style.display = "none";
  }
  // console.log(`.productStylesGrid-${this.dataset.tabId}`);
  let activeTab = document.querySelector(
    `.productStylesGrid-${this.dataset.tabId}`
  );
  activeTab.style.display = "grid";

  for (const arrow of tabArrows) {
    arrow.classList.remove("active");
  }

  this.querySelector(".productarrow").classList.add("active");
}

// for (let tab of tabArrows) {
//   tab.addEventListener("click", arrowFunction);
// }

// function arrowFunction(e) {
//   for (let tab of tabContent) {
//     tab.style.display = "none";
//   }
//   // console.log(`.productStylesGrid-${this.dataset.tabId}`);
//   let activeTab = document.querySelector(`.productTabs__tabs-${this.dataset.tabId}`)
//   activeTab.style.display = "block";
// }

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// progressbar-section

video.addEventListener("loadedmetadata", () => {
  progress.setAttribute("max", video.duration);
});

video.addEventListener("timeupdate", () => {
  progress.value = video.currentTime;
  progress.style.width = `${Math.floor(
    (video.currentTime * 100) / video.duration
  )}%`;
});

progress.addEventListener("mousedown", function () {
  video.pause();
});

progress.addEventListener("mouseup", function () {
  video.play();
});

// //Duration-section

video.addEventListener("loadeddata", () => {
  totalTimeElement.textContent = formatDuration(video.duration);
});
video.addEventListener("timeupdate", () => {
  currentTimeElement.textContent = formatDuration(video.currentTime);
});

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});

function formatDuration(time) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`;
  }
}

// volume button
muteBtn.addEventListener("click", toggleMute);
volumeSlider.addEventListener("input", (e) => {
  video.volume = e.target.value;
  video.muted = e.target.value === 0;
});
function toggleMute() {
  video.muted = !video.muted;
}

video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume;
  let volumeLevel;
  if (video.muted || video.volume === 0) {
    volumeSlider.value = 0;
    volumeLevel = "muted";
  } else {
    volumeLevel = "high";
  }

  videoContainer.dataset.volumeLevel = volumeLevel;
});

// fullscreen mode

if (!document?.fullscreenEnabled) {
  fullScreenBtn.style.display = "none";
}
fullScreenBtn.addEventListener("click", () => {
  fullScreenMode();
});
function fullScreenMode() {
  if (document.fullscreenElement !== null) {
    document.exitFullscreen();
    setFullscreenData(false);
  } else {
    setFullscreenData(true);
    video.requestFullscreen();
  }
}

function setFullscreenData(state) {
  video.setAttribute("data-fullscreen", !state);
}

document.addEventListener("fullscreenchange", () => {
  setFullscreenData(!document.fullscreenElement);
});

// play/pause section

playPauseBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
  videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
  videoContainer.classList.add("paused");
});
