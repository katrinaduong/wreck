
// $('.issue-button').click(function(){
//   $(this).toggleClass('issue-button-clicked');
// });
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var newWelcome = true

$('#add-issue').click(function() {
  $("#new-issue-text").focus()
  $("body").toggleClass("adding-issue");
  $("new-issue-text").focus();
});

$('#nevermind, .close-button').click(function() {
  $('body').toggleClass("adding-issue");
});

$("#new-issue-text").on('input',function(e){
  if(e.target.value === ''){
    // Textarea has no value
  } else {
    // Textarea has a value
    if (!$('#help-text').is(':hidden')) {
      $('#help-text').toggle();
    }
  }
});

$('#post').click(function() {
  if (newWelcome == true) {
    $('#new-welcome').toggle();
    newWelcome = false
  }
  var date = getCurrentTime()
  var text = $("#new-issue-text").val()
  if (text.length < 1) {
    $('#help-text').toggle();
  } else {
    var newPost =
    `<div class="issue">
      <div class="issue-date">${date}</div>
      <label class="issue-content">${text}</label>
      <hr>
      <div class="issue-footer">
        <div class="issue-react-angry issue-button">
          <button onclick="increment(this)" value="0">
            React 😠 <label class="angry-count"></label>
          </button>
        </div>
      </div>
    </div>`

    $('#issues-container').prepend(newPost)
    $('#new-issue-text').val("")
    $('body').toggleClass("adding-issue")
  }
});

function increment(react) {
  react.value = +react.value + 1
  react.innerText = "React 😠 (x" + react.value + ")"
}

function getCurrentTime() {
  var d = new Date()
  var hours = d.getHours()
  var minutes = d.getMinutes()
  var time = "PM"
  if (hours < 12) {
    time = "AM"
  }
  if (String(hours) == "0") {
    hours = "12"
  } else if (String(hours).length < 2) {
    hours = "0" + hours
  }
  if (String(minutes).length < 2) {
    minutes = "0" + minutes
  }
  var date = months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " "
    + hours + ":" + minutes + " " + time
  return date
}
