const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			entry.target.classList.toggle("is-visible", entry.isIntersecting);
		});
	},
	{
		// Umbral alto (p. ej. 0.6) con paneles más altos que el viewport puede dejar
		// el panel sin "is-visible" y el contenido queda en opacity: 0 (pantalla en blanco).
		threshold: 0.2,
		rootMargin: "0px 0px -8% 0px",
	}
);

document.querySelectorAll(".panel").forEach((panel) => observer.observe(panel));

// Music control
const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const volumeSlider = document.getElementById("volume-slider");
const musicControl = document.querySelector(".music-control");
const musicDialog = document.getElementById("music-dialog");

let isPlaying = false;
let dialogTimeout;

if (bgMusic && musicToggle && volumeSlider && musicControl) {
	bgMusic.volume = 0.5;
	volumeSlider.value = 50;

	const updateButtonLabel = () => {
		musicToggle.setAttribute("aria-label", isPlaying ? "Silenciar música" : "Reproducir música");
	};

	const showDialog = () => {
		if (!musicDialog) return;
		musicDialog.classList.add("visible");
		clearTimeout(dialogTimeout);
		dialogTimeout = setTimeout(() => musicDialog.classList.remove("visible"), 4500);
	};

	const hideDialog = () => {
		if (!musicDialog) return;
		musicDialog.classList.remove("visible");
		clearTimeout(dialogTimeout);
	};

	const playMusic = async () => {
		try {
			await bgMusic.play();
			isPlaying = true;
			musicControl.classList.add("playing");
			updateButtonLabel();
		} catch (error) {
			console.warn("Autoplay bloqueado", error);
		}
	};

	musicToggle.addEventListener("click", () => {
		if (isPlaying) {
			bgMusic.pause();
			musicControl.classList.remove("playing");
		} else {
			bgMusic.play();
			musicControl.classList.add("playing");
		}
		isPlaying = !isPlaying;
		updateButtonLabel();
		hideDialog();
	});

	volumeSlider.addEventListener("input", (event) => {
		bgMusic.volume = event.target.value / 100;
	});

	window.addEventListener("DOMContentLoaded", () => {
		playMusic();
		showDialog();
	});
}
