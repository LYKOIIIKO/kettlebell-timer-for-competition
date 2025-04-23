let App = function () {
	let elems = null,
		stopwatchWork = false;

	const createUI = () => {
		let wrapperElem = document.createElement('div')
		wrapperElem.classList.add('wrapper')
		let timerElem = document.createElement('div')
		timerElem.classList.add('timer')
		let timerInnerElem = document.createElement('timer_inner')
		timerInnerElem.classList.add('timer__inner')
		let counterElem = document.createElement('div')
		counterElem.classList.add('counter')
		let counterInnerElem = document.createElement('counter__inner')
		counterInnerElem.classList.add('counter__inner')

		timerInnerElem.innerHTML = '00:00'
		counterInnerElem.innerHTML = '0'

		timerElem.title = 'Click to start / double click to restart'

		counterElem.append(counterInnerElem)
		timerElem.append(timerInnerElem)
		wrapperElem.append(timerElem, counterElem)

		timerInnerElem.addEventListener('click', () => {
			if (!stopwatchWork) {
				stopwatch(timerInnerElem)
				timerInnerElem.removeEventListener('dblclick', clearUI)
				timerInnerElem.addEventListener('dblclick', clearUI)
			}
		})

		counterInnerElem.addEventListener('click', () => {
			if (stopwatchWork && counterInnerElem.innerHTML < 9999) counterInnerElem.innerHTML++
		})
		counterInnerElem.addEventListener('contextmenu', () => {
			event.preventDefault()
			if (counterInnerElem.innerHTML > 0) counterInnerElem.innerHTML--
		})


		return {
			timer: timerInnerElem,
			counter: counterInnerElem,
			main: wrapperElem
		}
	}


	const stopwatch = (elem) => {
		stopwatchWork = true;
		let hours1 = 0,
			hours2 = 0,
			minutes1 = 0,
			minutes2 = 1,
			timer;

		stopwatchInterval = setInterval(() => {
			timer = hours1 + '' + hours2 + ':' + minutes1 + '' + minutes2;

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

			if (hours1 == 10) clearInterval(timerLive);

			elem.innerHTML = timer;
		}, 1000, elem);
	}

	const clearUI = () => {
		clearInterval(stopwatchInterval)
		stopwatchWork = false
		elems.timer.innerHTML = '00:00'
		elems.counter.innerHTML = '0'
	}

	const init = () => {
		elems = createUI()
		let root = document.getElementById('root')
		root.append(elems.main)
	}

	init()
}

window.addEventListener('load', () => {
	new App();
})