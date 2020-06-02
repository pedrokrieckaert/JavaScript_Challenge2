/*Housekeeping Notes
This document features some template literals, which allows me to embbed JS straight into a string without the whole:
"blah blah" + var + "blah blah".
There is a similarity to this in the React framework, and I only now found out about this.
*/

var dt = new Date();

var min = dt.getMinutes();
var minHand = document.querySelector("#clockMinute");

var hour = dt.getHours();
var hourHand = document.querySelector("#clockHour");

//Used to sync the interval to real world time.
var sec = dt.getSeconds();

var time = document.querySelector("#time");
/*Here is what looks like some complex code, because these are solutions found online I'll explain what it does.
Essentially its a use of the hour and min variable to output their values.
However, if it was done with the variables it would show something like 12:5 whereas I'd want it show 12:05.
So whats done to the min variable is: as a string 0 is added before the value of min.
Using the slice function it makes sure to only take the last two values in the string.
So, if the time were 15 min it would cut 015 down to just the 15 we'd need.
As for the AM PM, this is an inline if statement that just checks if the value of hour is less than 12.
If it is, it'll show AM, otherwise it'll show PM.
*/
time.innerHTML = `${hour}:${("0" + min).slice(-2)} ${(hour < 12) ? "AM" : "PM"}`;

var dateDisplay = document.querySelector("#date");
dateDisplay.innerHTML = `${dt.getDay()}/${dt.getMonth() + 1}/${dt.getFullYear()}`;

/*This changes the styling of the hands and rotates them.
This results in inline styling.
Translate along with transform-origin are what perfectly center the elements.
*/
minHand.setAttribute("style", `transform: rotate(${min * 6}deg) translate(-50%,-50%)`);
//The hour rotation is set to make 2 full rotations, to fit the style of 1-12 clocks.
hourHand.setAttribute("style", `transform: rotate(${hour * 30}deg) translate(-50%, -50%)`);

//Code to switch out the entire stylesheet based on time range.
//This can also be done by inlining the body, but this cooler and has better flexibility for more complex style changes.
//Also a button to manual overide the theme.
var style = document.querySelector("#pageTheme");
var themeBtn = document.querySelector("#themeBtn");
themeBtn.addEventListener("click", themeSwitch);
var themeOveride = false;
if(hour >= 7 && hour <= 20){
    style.setAttribute("href", "CSS/dayStyle.css");
    themeBtn.innerHTML = "Dark Theme"
} else {
    style.setAttribute("href", "CSS/nightStyle.css");
    themeBtn.innerHTML = "Light Theme"
}

var clockBorder = document.querySelector("#clockBorder g");

for(i = 1; i < 61; i++){
    var rot = i * 6;
    var line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute("y1","0");
    line.setAttribute("x2","250");
    line.setAttribute("y2","0");
    line.setAttribute("style", `transform: rotate(${rot}deg)`);
    if(i%5===0){
        line.setAttribute("x1","230");
        line.setAttribute("style", `transform: rotate(${rot}deg); stroke-width:3;`);
    } else {
        line.setAttribute("x1","240");
    }
    clockBorder.appendChild(line)
}

/* A set if code to handle when the interval should start.
When the script is run, doesn't mean it was run at the exact 0 second of a new minute.
This means there is a desync with my clock and real world time.
Instead the update function for the hands is set to a timeout of the seconds remaining before a new minute.
After that the 60 sec interval function is run and will update every real world minute.
*/
if (sec !== 0){
    setTimeout(function(){
            //When the timeout fires, this is the first instance of a minute passed, hence it should also update the hands before setting an interval.
            updateHands();
        setInterval(function(){
            updateHands();
        },60000);
    //Seconds before a new minute
    },(60-sec)*1000);
} else {
    setInterval(function(){
        updateHands();
    },60000);
}

//Updating the variables with new date times, no real need to apply logic to only update the hour every hour, unless for very small optimization.
function updateHands(){
    dt = new Date();
    min = dt.getMinutes();
    hour = dt.getHours();
    time.innerHTML = `${hour}:${("0" + min).slice(-2)} ${(hour < 12) ? "AM" : "PM"}`;
    //Transistion style is only included in the update to prevent strange animation on page load.
    minHand.setAttribute("style", `transform: rotate(${min * 6}deg) translate(-50%,-50%); transition: 0.5s;`);
    hourHand.setAttribute("style", `transform: rotate(${hour * 30}deg) translate(-50%, -50%); transition: 0.5s;`);

    if(themeOveride === false){
        if(hour >= 7 && hour <= 20){
            style.setAttribute("href", "CSS/dayStyle.css");
        } else {
            style.setAttribute("href", "CSS/nightStyle.css");
        }
    }
}

//The function to manual overide the theme.
//It compares the href attribute of the link element to determine which stylesheet to switch too.
function themeSwitch(){
    var prevStyle = style.getAttribute("href");
    if(themeBtn.innerHTML === "Dark Theme"){
        style.setAttribute("href", "CSS/nightStyle.css");
        themeBtn.innerHTML = "Light Theme"
    } else {
        style.setAttribute("href", "CSS/dayStyle.css");
        themeBtn.innerHTML = "Dark Theme"
    }

    if(prevStyle === style.getAttribute("href")){
        themeOveride = false;
    } else {
        themeOveride = true;
    }
}
