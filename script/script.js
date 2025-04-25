let App = function () {
	let elems = null,
		stopwatchWork = false,
		stopwatchStop = "",
		stopwatchStoped = false;

	const createUI = () => {
		let wrapperElem = document.createElement("div");
		wrapperElem.classList.add("wrapper");
		let timerElem = document.createElement("div");
		timerElem.classList.add("timer");
		let counterElem = document.createElement("div");
		counterElem.classList.add("counter");

		let timerMinElem = document.createElement("div");
		timerMinElem.classList.add("timer__min");
		let timerColonElem = document.createElement("div");
		timerColonElem.classList.add("timer__colon");
		let timerSecElem = document.createElement("div");
		timerSecElem.classList.add("timer__sec");

		let counterInnerElem = document.createElement("div");
		counterInnerElem.classList.add("counter__inner");

		let timeBtnsElem = document.createElement("div");
		timeBtnsElem.classList.add("time__btns");

		createTimeBtn(timeBtnsElem, "10:00");
		createTimeBtn(timeBtnsElem, "12:00");
		createTimeBtn(timeBtnsElem, "15:00");

		counterInnerElem.innerHTML = "0";
		timerMinElem.innerHTML = "00";
		timerColonElem.innerHTML = ":";
		timerSecElem.innerHTML = "00";

		timerElem.title = "Click to start / double click to restart";

		counterElem.append(timeBtnsElem, counterInnerElem);
		timerElem.append(timerMinElem, timerColonElem, timerSecElem);
		wrapperElem.append(timerElem, counterElem);

		timerElem.addEventListener("click", () => {
			if (!stopwatchWork) {
				stopwatch(timerMinElem, timerSecElem);
				timerElem.removeEventListener("dblclick", clearUI);
				timerElem.addEventListener("dblclick", clearUI);
			}
		});

		counterInnerElem.addEventListener("click", () => {
			if (
				!stopwatchStoped &&
				stopwatchWork &&
				counterInnerElem.innerHTML < 9999
			)
				counterInnerElem.innerHTML++;
		});
		counterInnerElem.addEventListener("contextmenu", () => {
			event.preventDefault();
			if (!stopwatchStoped && counterInnerElem.innerHTML > 0)
				counterInnerElem.innerHTML--;
		});

		return {
			timer: timerElem,
			timerMin: timerMinElem,
			timerSec: timerSecElem,
			counter: counterInnerElem,
			main: wrapperElem,
			btns: timeBtnsElem,
		};
	};

	const createTimeBtn = (box, time) => {
		let timeBtnElem = document.createElement("div");
		timeBtnElem.classList.add("time__btn");

		timeBtnElem.innerHTML = time;

		box.append(timeBtnElem);
	};

	const setActive = () => {
		let btns = document.querySelectorAll(".time__btn");
		setStopwatch(btns[0])

		btns.forEach((item) => {
			item.addEventListener("click", (event) => {
				if (!stopwatchWork) {
					btns.forEach((item) => {
						item.classList.remove("active");
					});
					setStopwatch(item)
				}
			});
		});
	};

	const setStopwatch = (elem) => {
		elem.classList.add("active");
		elems.timerMin.innerHTML = elem.innerHTML[0] + elem.innerHTML[1];
		stopwatchStop = elem.innerHTML;
	}

	const stopwatch = (minElem, secElem) => {
		stopwatchWork = true;
		stopwatchStoped = false;
		let hours1 = 0,
			hours2 = 0,
			minutes1 = 0,
			minutes2 = 1,
			timerMin,
			timerSec;

		stopwatchInterval = setInterval(
			() => {
				if (hours1 == stopwatchStop[0] && hours2 == stopwatchStop[1]) {
					clearInterval(stopwatchInterval);
					stopwatchStoped = true;
				}

				timerMin = hours1 + "" + hours2;
				timerSec = minutes1 + "" + minutes2;

				if (minutes2 < 10) minutes2++;
				if (minutes2 == 10) {
					minutes2 = 0;
					minutes1++;
				}

				if (minutes1 == 6) {
					minutes1 = 0;
					hours2++;
				}

				if (hours2 == 10) {
					hours2 = 0;
					hours1++;
				}

				if (hours1 == 10) clearInterval(stopwatchInterval);

				minElem.innerHTML = timerMin;
				secElem.innerHTML = timerSec;
			},
			1000,
			minElem,
			secElem
		);
	};

	const clearUI = () => {
		clearInterval(stopwatchInterval);
		stopwatchWork = false;
		let btns = document.querySelectorAll(".time__btn");
		btns.forEach((item) => {
			item.classList.remove('active')
		})
		setStopwatch(elems.btns.firstChild)
		elems.timerSec.innerHTML = '00'
		elems.counter.innerHTML = "0";
	};

	const init = () => {
		elems = createUI();
		let root = document.getElementById("root");
		root.append(elems.main);
		setActive();
	};

	init();
};

window.addEventListener("load", () => {
	new App();
});
