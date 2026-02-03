let App = function () {
	let elems = null,
		stopwatchWork = false,
		stopwatchStoped = false,
		defaultTime = 0,
		savedMinutes = "",
		savedSeconds = "",
		checkManualTimeSet = false,
		tooltipElem = null

	const createUI = () => {
		let wrapperElem = document.createElement("div")
		wrapperElem.classList.add("wrapper")

		let timerElem = document.createElement("div")
		timerElem.classList.add("timer")

		let counterElem = document.createElement("div")
		counterElem.classList.add("counter")

		let timerMinElem = document.createElement("div")
		timerMinElem.classList.add("timer__min")

		let timerColonElem = document.createElement("div")
		timerColonElem.classList.add("timer__colon")

		let timerSecElem = document.createElement("div")
		timerSecElem.classList.add("timer__sec")

		let counterInnerElem = document.createElement("div")
		counterInnerElem.classList.add("counter__inner")

		let timeBtnsElem = document.createElement("div")
		timeBtnsElem.classList.add("time__btns")

		// Добавляем поле для ручного ввода
		let manualInputElem = document.createElement("div")
		manualInputElem.classList.add("manual-input")

		let inputWrapper = document.createElement("div")
		inputWrapper.classList.add("manual-input__wrapper")

		let minutesInput = document.createElement("input")
		minutesInput.type = "number"
		minutesInput.name = "minutes"
		minutesInput.classList.add("manual-input__minutes")
		minutesInput.placeholder = "min"
		minutesInput.min = 0
		minutesInput.max = 99

		let colonSpan = document.createElement("span")
		colonSpan.classList.add("manual-input__colon")
		colonSpan.textContent = ":"

		let secondsInput = document.createElement("input")
		secondsInput.type = "number"
		secondsInput.name = "seconds"
		secondsInput.classList.add("manual-input__seconds")
		secondsInput.placeholder = "sec"
		secondsInput.min = 0
		secondsInput.max = 59

		let setTimeBtn = document.createElement("button")
		setTimeBtn.classList.add("manual-input__btn")
		setTimeBtn.textContent = "SET"

		inputWrapper.append(minutesInput, colonSpan, secondsInput, setTimeBtn)
		manualInputElem.append(inputWrapper)

		createTimeBtn(timeBtnsElem, "10:00")
		createTimeBtn(timeBtnsElem, "12:00")
		createTimeBtn(timeBtnsElem, "15:00")

		counterInnerElem.innerHTML = "0"
		timerMinElem.innerHTML = "00"
		timerColonElem.innerHTML = ":"
		timerSecElem.innerHTML = "00"

		timerElem.title = "Click to start / double click to restart"

		// Создаем элемент подсказки
		tooltipElem = document.createElement("div")
		tooltipElem.classList.add("tooltip")
		tooltipElem.textContent = "Click to start / double click to restart"
		tooltipElem.style.opacity = "1" // Начальная видимость
		tooltipElem.style.transition = "opacity 0.3s ease"

		timeBtnsElem.append(manualInputElem)
		counterElem.append(timeBtnsElem, counterInnerElem)
		timerElem.append(timerMinElem, timerColonElem, timerSecElem)
		wrapperElem.append(timerElem, counterElem, tooltipElem)

		timerElem.addEventListener("click", () => {
			if (!stopwatchWork) {
				// Если таймер закончился
				if (stopwatchStoped) {
					// Устанавливаем последнее сохраненное время
					timerMinElem.innerHTML = savedMinutes || "10"
					timerSecElem.innerHTML = savedSeconds || "00"
					elems.counter.innerHTML = "0"
					stopwatchStoped = false // Сбрасываем флаг

					// Возвращаем стандартную подсказку
					if (elems.tooltip) {
						elems.tooltip.textContent = "Click to start / double click to restart"
						setTimeout(() => {
							elems.tooltip.style.opacity = "1"
						}, 50)
					}
					return
				}

				// Сохраняем текущее время перед запуском
				savedMinutes = timerMinElem.innerHTML
				savedSeconds = timerSecElem.innerHTML

				stopwatch(timerMinElem, timerSecElem)
				timerElem.removeEventListener("dblclick", clearUI)
				timerElem.addEventListener("dblclick", clearUI)
			}
		})

		counterInnerElem.addEventListener("click", () => {
			if (!stopwatchStoped && stopwatchWork && counterInnerElem.innerHTML < 9999) counterInnerElem.innerHTML++
		})

		counterInnerElem.addEventListener("contextmenu", (event) => {
			event.preventDefault()
			if (!stopwatchStoped && counterInnerElem.innerHTML > 0) counterInnerElem.innerHTML--
		})

		// Обработчик для форматирования ввода
		minutesInput.addEventListener("input", (e) => {
			let value = e.target.value
			if (value === "") return

			let numValue = Number.parseInt(value) || 0
			if (numValue < 0) numValue = 0
			if (numValue > 99) numValue = 99

			// Форматируем как двузначное число
			e.target.value = numValue.toString().padStart(2, "0")
		})

		secondsInput.addEventListener("input", (e) => {
			let value = e.target.value
			if (value === "") return

			let numValue = Number.parseInt(value) || 0
			if (numValue < 0) numValue = 0
			if (numValue > 59) numValue = 59

			// Форматируем как двузначное число
			e.target.value = numValue.toString().padStart(2, "0")
		})

		// Обработчик для установки времени вручную
		setTimeBtn.addEventListener("click", () => {
			if (!stopwatchWork) {
				let minutes = Number.parseInt(minutesInput.value) || 0
				let seconds = Number.parseInt(secondsInput.value) || 0

				// Валидация ввода
				if (minutes < 0) minutes = 0
				if (minutes > 99) minutes = 99
				if (seconds < 0) seconds = 0
				if (seconds > 59) seconds = 59

				// Если секунды превышают 59, добавляем минуты
				if (seconds >= 60) {
					minutes += Math.floor(seconds / 60)
					seconds = seconds % 60
					if (minutes > 99) minutes = 99
				}

				// Форматируем и обновляем поля ввода
				minutesInput.value = minutes.toString().padStart(2, "0")
				secondsInput.value = seconds.toString().padStart(2, "0")

				// Форматируем время для отображения
				let formattedMinutes = minutes.toString().padStart(2, "0")
				let formattedSeconds = seconds.toString().padStart(2, "0")

				// Устанавливаем таймер
				timerMinElem.innerHTML = formattedMinutes
				timerSecElem.innerHTML = formattedSeconds
				savedMinutes = formattedMinutes
				savedSeconds = formattedSeconds

				//Запоминаем что используем ручной ввод
				checkManualTimeSet = true

				// Снимаем выделение с кнопок
				let btns = document.querySelectorAll(".time__btn")
				btns.forEach((item) => {
					item.classList.remove("active")
				})
			}
		})

		return {
			timer: timerElem,
			timerMin: timerMinElem,
			timerSec: timerSecElem,
			counter: counterInnerElem,
			main: wrapperElem,
			btns: timeBtnsElem,
			minutesInput: minutesInput,
			secondsInput: secondsInput,
			setTimeBtn: setTimeBtn,
			manualInput: manualInputElem,
			tooltip: tooltipElem,
		}
	}

	const createTimeBtn = (box, time) => {
		let timeBtnElem = document.createElement("div")
		timeBtnElem.classList.add("time__btn")

		timeBtnElem.innerHTML = time

		box.append(timeBtnElem)
	}

	const setActive = () => {
		checkManualTimeSet = false
		let btns = document.querySelectorAll(".time__btn")
		setStopwatch(btns[defaultTime])

		btns.forEach((item, index) => {
			item.addEventListener("click", () => {
				if (!stopwatchWork) {
					btns.forEach((item) => {
						item.classList.remove("active")
					})
					setStopwatch(item)
					defaultTime = index
				}
			})
		})
	}

	const setStopwatch = (elem) => {
		checkManualTimeSet = false
		elem.classList.add("active")
		elems.timerMin.innerHTML = elem.innerHTML[0] + elem.innerHTML[1]
		elems.timerSec.innerHTML = "00"
		elems.counter.innerHTML = "0"
	}

	const stopwatch = (minElem, secElem) => {
		stopwatchWork = true
		stopwatchStoped = false
		elems.counter.innerHTML = "0"

		// Получаем текущие значения минут и секунд из таймера
		let currentMinutes = Number.parseInt(minElem.innerHTML)
		let currentSeconds = Number.parseInt(secElem.innerHTML)

		// Проверяем, есть ли установленное время
		if (currentMinutes === 0 && currentSeconds === 0) {
			// Если время не установлено, используем сохраненное время или кнопку по умолчанию
			if (savedMinutes && savedSeconds) {
				currentMinutes = Number.parseInt(savedMinutes)
				currentSeconds = Number.parseInt(savedSeconds)
			} else {
				currentMinutes = 10
				currentSeconds = 0
			}
			minElem.innerHTML = currentMinutes.toString().padStart(2, "0")
			secElem.innerHTML = currentSeconds.toString().padStart(2, "0")
		}

		if (elems.tooltip) {
			elems.tooltip.style.opacity = "0"
			elems.tooltip.style.pointerEvents = "none" // Отключаем взаимодействие
		}

		stopwatchInterval = setInterval(
			() => {
				// Декрементируем секунды
				currentSeconds--

				// Если секунды стали отрицательными, уменьшаем минуты
				if (currentSeconds < 0) {
					currentMinutes--
					currentSeconds = 59
				}

				// Если время истекло
				if (currentMinutes < 0) {
					clearInterval(stopwatchInterval)
					stopwatchWork = false
					stopwatchStoped = true

					minElem.innerHTML = "00"
					secElem.innerHTML = "00"

					if (elems.tooltip) {
						elems.tooltip.textContent = "Timer stopped"
						setTimeout(() => {
							elems.tooltip.style.opacity = "1"
							elems.tooltip.style.pointerEvents = "auto"
						}, 300)
					}

					return
				}

				// Обновляем отображение
				minElem.innerHTML = currentMinutes.toString().padStart(2, "0")
				secElem.innerHTML = currentSeconds.toString().padStart(2, "0")
			},
			1000,
			minElem,
			secElem,
		)
	}

	const clearUI = () => {
		clearInterval(stopwatchInterval)
		stopwatchWork = false
		stopwatchStoped = false
		let btns = document.querySelectorAll(".time__btn")
		btns.forEach((item) => {
			item.classList.remove("active")
		})

		if (!checkManualTimeSet) {
			setStopwatch(btns[defaultTime])
		} else {
			elems.timerMin.innerHTML = savedMinutes
			elems.timerSec.innerHTML = savedSeconds
		}
		elems.counter.innerHTML = "0"

		// Показываем подсказку при остановке таймера
		if (elems.tooltip) {
			elems.tooltip.textContent = "Click to start / double click to restart"
			setTimeout(() => {
				elems.tooltip.style.opacity = "1"
				elems.tooltip.style.pointerEvents = "auto"
			}, 300)
		}
	}

	const init = () => {
		elems = createUI()
		let root = document.getElementById("root")
		root.append(elems.main)
		setActive()
	}

	init()
}

window.addEventListener("load", () => {
	new App()
})
