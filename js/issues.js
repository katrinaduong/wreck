//
// $('.issue-button').click(function(){
//   $(this).toggleClass('issue-button-clicked');
// });
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var newWelcome = true

$('#add-issue').click(function() {
  $("#new-issue-text").focus()
  $("body").toggleClass("adding-issue");
});

$('#nevermind, .close-button').click(function() {
  $('body').toggleClass("adding-issue");
});

$('#post').click(function() {
  if (newWelcome == true) {
    $('#new-welcome').toggle();
    newWelcome = false
  }
  var date = getCurrentTime()
  var text = $("#new-issue-text").val()
  var newPost =
  `<div class="issue">
    <div class="issue-date">${date}</div>
    <label class="issue-content">${text}</label>
    <hr>
    <div class="issue-footer">
      <div class="issue-reply issue-button">
        <i class="fa fa-reply"></i>
        Reply
      </div>
      <div class="issue-react-angry issue-button">
        React 😠 <label class="angry-count"></label>
      </div>
    </div>
  </div>`

  $('#issues-container').prepend(newPost)
  $('#new-issue-text').val("")
  $('body').toggleClass("adding-issue")
});

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
