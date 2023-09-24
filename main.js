import confetti from "canvas-confetti"
////// query selectors
const eventContainer = document.querySelector(".event-container")
const formContainer = document.querySelector(".form-container")
const form = document.querySelector("form")
const deleteBtn = document.querySelector('.event__btn')

// Event selectors
const dayTitle = document.querySelector("#day__title")
const dayName = document.querySelector("#day__name")
const hourTitle = document.querySelector("#hour__title")
const hourName = document.querySelector("#hour__name")
const minuteTitle = document.querySelector("#minute__title")
const minuteName = document.querySelector("#minute__name")
const secondsTitle = document.querySelector("#seconds__title")
const secondsName = document.querySelector("#seconds__name")

// Time selectors
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = 24 * hour;

// countdownTimer
let countdownTimer;


////// FUNCTIONS

// Function: Add hidden class
function addHiddenClass(element) {
   element.classList.add("hidden")
}

// Function: remove hidden class
function removeHiddenClass(element) {
   element.classList.remove("hidden")
}

// Function: check storage
function checkLocalStorage() {
  if(localStorage.getItem('eventTracker.event') === "",localStorage.getItem('eventTracker.event') === "[]", localStorage.getItem('eventTracker.event') === null) {
    showForm()
  } else {
    const event = JSON.parse(localStorage.getItem("eventTracker.event"))
    showEvent(event.title, event.date)
  }
}

// Function: save to local storage
function saveEventToLocalStorage(title,event) {
  const newEvent = {
    title,
    event,
  }
  localStorage.setItem('eventTracker.event', JSON.stringify(newEvent))
}

// Function: delete event from local storage
function deleteEventFromLocalStorage() {
  localStorage.removeItem('eventTracker.event')
}

// Function: show form
function showForm() {
  removeHiddenClass(formContainer);
  addHiddenClass(eventContainer);
  deleteEventFromLocalStorage();
  const title = document.querySelector("#title")
  title.focus();
}

// Function: start the countdown timer
function startCountdownTimer(title, date) {
  const eventTitle = document.querySelector('.event__title')
  eventTitle.textContent = title
  updateCountdown(date)
  countdownTimer = setInterval(() => {
    updateCountdown(date)
  },1000)
}

// Function: update countdown
function updateCountdown(date) {
  const currentTime = new Date().getTime();
  const countdownTime = date - currentTime;
 

  // Time math
  const newDay = Math.floor(countdownTime / day);
  const newHour = Math.floor((countdownTime % day) / hour);
  const newMinute = Math.floor((countdownTime % hour) / minute);
  const newSecond = Math.floor((countdownTime % minute) / second);

  // Update Event
  dayTitle.textContent = newDay
  hourTitle.textContent = newHour
  minuteTitle.textContent = newMinute
  secondsTitle.textContent = newSecond

  // Update names
  dayName.textContent = `day${newDay === 1 ? '' : 's'}`
  hourName.textContent = `hour${newDay === 1 ? '' : 's'}`
  minuteName.textContent = `minute${newDay === 1 ? '' : 's'}`
  secondsName.textContent = `second${newDay === 1 ? '' : 's'}`

  if(newDay === 0 && newHour === 0 && newMinute === 0 && newSecond === 0) {

    let duration = 3 * 1000;
    let end = Date.now() + duration;

    (function frame() {
      // launch a few confetti from the left edge
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      // and launch a few from the right edge
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

    // keep going until we are out of time
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
    clearInterval(countdownTimer)
    setTimeout(() => {
      showForm()
    }, 2000)
  }
}

// Function: show event
function showEvent(title,event) {
  saveEventToLocalStorage(title,event)  
  startCountdownTimer(title,event)
  removeHiddenClass(eventContainer);
  addHiddenClass(formContainer);
}



////// EVENTS

// Event: Window Load
window.addEventListener('DOMContentLoaded', checkLocalStorage)


// Event: Submit
form.addEventListener("submit",(e) => {
  e.preventDefault();
  const title = document.querySelector("#title")
  const eventInput= document.querySelector("#event")
  const event = new Date(eventInput.value).getTime()

  // validater
  if(title.value === '' || eventInput.value === '') {
    return alert("Please enter a title and a date");
  }
  showEvent(title.value, event);

  // clear
  title.value = ''
  eventInput.value = ''

})

// Event: delete Event
deleteBtn.addEventListener("click", showForm)