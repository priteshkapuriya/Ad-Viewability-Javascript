/************************************************************************************************
 *                                                                                              *
 *                              VARIABLES DECLARATION                                           *
 *                                                                                              *
 ************************************************************************************************/
var adIsViewable = true,
  adViewablePercentage = 100,
  viewabilityTime = 0,
  secondsIntervalId,
  topPercentage = 100,
  leftPercentage = 100,
  rightPercentage = 100,
  bottomPercentage = 100,
  timeoutInMiliseconds = 10000,
  userTimeoutId,
  isActiveUser = "Active User",
  adElement = document.getElementById("ad"),
  activeUserElem = document.getElementById("activeUser"),
  time = document.getElementById("time"),
  viewAbility = document.getElementById("viewAbility"),
  percentage = document.getElementById("percentage");

/**
 * Logs the viewability values in the console
 *
 *
 */

window.log = function () {
  console.log(
    "Ad is viewable: ",
    adIsViewable,
    "\nViewability time of the ad in sec:",
    viewabilityTime,
    "\nadViewablePercentage: ",
    adViewablePercentage + "%"
  );
  updateDiv();
};

/************************************************************************************************
 *                                                                                              *
 *                              YOUR IMPLEMENTATION                                             *
 *                                                                                              *
 ************************************************************************************************/

//on page load call all the required functions for the first time
window.onload = function (event) {
  console.log("page is fully loaded");
  scrollEventHandler();
  setupEvents();
};

//updates the fixed Div to show all the viewability measurements
function updateDiv() {
  if (isActiveUser === "Inactive User") {
    activeUserElem.style.backgroundColor = "#d54858";
  } else {
    activeUserElem.style.backgroundColor = "#54ae32";
  }
  if(adIsViewable){
    viewAbility.style.backgroundColor = "#54ae32";
  } else {
    viewAbility.style.backgroundColor = "#d54858";
  }
  viewAbility.innerText = adIsViewable;
  activeUserElem.innerText = isActiveUser;
  time.innerText = viewabilityTime + "s";
  percentage.innerText = adViewablePercentage + "%";
}

// detach events
function removeEvents() {
  document.removeEventListener("mousemove", resetTimer, false);
  document.removeEventListener("mousedown", resetTimer, false);
  document.removeEventListener("onkeydown", resetTimer, false);
  document.removeEventListener("scroll", resetTimer, false);
  document.removeEventListener("scroll", scrollEventHandler, false);
}

//window focus event
window.addEventListener(
  "focus",
  function (event) {
    console.log("focus");
    isActiveUser = "Active User";
    setupEvents();
    scrollEventHandler();
    startadViewTimer();
  },
  false
);

//window unfocused event
window.addEventListener(
  "blur",
  function (event) {
    console.log("blured");
    isActiveUser = "Inactive User";
    window.clearTimeout(userTimeoutId);
    removeEvents();
    pauseadViewTimer();
  },
  false
);

// counter for mumber of seconds ad is viewed
function startadViewTimer() {
  if (!secondsIntervalId && adIsViewable) {
    secondsIntervalId = setInterval(function () {
      viewabilityTime++;
    }, 1000);
  }
}

//pause the time in any event when user is not watching Ad
function pauseadViewTimer() {
  clearInterval(secondsIntervalId);
  secondsIntervalId = false;
}

// timer to calculate user inactivity
function startTimer() {
  userTimeoutId = window.setTimeout(doInactive, timeoutInMiliseconds);
}

// if user interacts before startTimer timeout time then reset timer
function resetTimer() {
  isActiveUser = "Active User";
  window.clearTimeout(userTimeoutId);
  startTimer();
  startadViewTimer();
}

// gets called when user is inactive
function doInactive() {
  console.log("User is inactive");
  isActiveUser = "Inactive User";
  pauseadViewTimer();
}

// setting up events to check user activity and elements position on scroll
function setupEvents() {
  document.addEventListener("mousemove", resetTimer, false);
  document.addEventListener("mousedown", resetTimer, false);
  document.addEventListener("keydown", resetTimer, false);
  document.addEventListener("scroll", resetTimer, false);
  document.addEventListener("scroll", scrollEventHandler, false);

  startTimer();
}

// scroll event callback function
function scrollEventHandler() {
  if (!isIntoView(adElement)) {
    adIsViewable = false;
    pauseadViewTimer();
  } else {
    adIsViewable = true;
    startadViewTimer();
  }
}

// logic to check what portion of div is still in viewport after scroll
function isIntoView(el) {
  var bounding = el.getBoundingClientRect();
  var elHeight = el.offsetHeight;
  var elWidth = el.offsetWidth;

  //checking div's effective height/width based on element's getBoundingClientRect
  if (bounding.top < 0) {
    var effHeight = elHeight + bounding.top;
    topPercentage = parseInt((effHeight * 100) / elHeight);
  }
  if (bounding.left < 0) {
    var effWidth = elWidth + bounding.left;
    leftPercentage = parseInt((effWidth * 100) / elWidth);
  }
  if (
    bounding.right >=
    (window.innerWidth || document.documentElement.clientWidth)
  ) {
    var widthDiff =
      bounding.right -
      (window.innerWidth || document.documentElement.clientWidth);
    var effWidth = elWidth - widthDiff;
    rightPercentage = parseInt((effWidth * 100) / elWidth);
  }
  if (
    bounding.bottom >=
    (window.innerHeight || document.documentElement.clientHeight)
  ) {
    var heightDiff =
      bounding.bottom -
      (window.innerHeight || document.documentElement.clientHeight);
    var effHeight = elHeight - heightDiff;
    bottomPercentage = parseInt((effHeight * 100) / elHeight);
  }

  //checking if div is inside viewport or not and if it's not fully visible than how much part is visible
  //Also checking if elements visible part is more than 50% to consider it as visible
  //Incase of minus values for percentage we are reassigning it as zero percent
  if (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth) &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight)
  ) {
    adViewablePercentage = 100;
    isVisible = true;
  } else if (
    Math.min(
      topPercentage,
      leftPercentage,
      rightPercentage,
      bottomPercentage
    ) >= 50
  ) {
    adViewablePercentage = Math.min(
      topPercentage,
      leftPercentage,
      rightPercentage,
      bottomPercentage
    );
    isVisible = true;
  } else {
    if (
      Math.min(
        topPercentage,
        leftPercentage,
        rightPercentage,
        bottomPercentage
      ) > 0
    ) {
      adViewablePercentage = Math.min(
        topPercentage,
        leftPercentage,
        rightPercentage,
        bottomPercentage
      );
    } else {
      adViewablePercentage = 0;
    }
    isVisible = false;
  }
  return isVisible;
}
