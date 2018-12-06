
// $('.issue-button').click(function(){
//   $(this).toggleClass('issue-button-clicked');
// });
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var personal_balance = 20.00
var group_balance = 0.00
var penalty_amount = 5.00

$('#add-issue').click(function() {
  $("#new-issue-text").focus();
  $("body").toggleClass("adding-issue");
  $("new-issue-text").focus();
});

$('#menu').click(function() {
  $('#sidebar').css("left", "0");
  $('#sidebar').css("transition", "1s");
  $('#dark-blur').css("visibility", "visible");
  $('#group-balance').text("$" + parseFloat(group_balance).toFixed(2));
  $('#personal-balance').text("$" + parseFloat(personal_balance).toFixed(2));
  $('#penalty-balance').text("$" + parseFloat(penalty_amount).toFixed(2));
});

$('.close-sidebar').click(function() {
  $('#sidebar').css("left", "-60%");
  $('#sidebar').css("transition", "1s");
  $('#dark-blur').css("visibility", "hidden");
});

$('logout').click(function() {
  // TODO: Give logout functionality here
});

$('#nevermind, .close-button').click(function() {
  $('body').toggleClass("adding-issue");
  $("#new-issue-text").val('');
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

$('.close-issue').click(function(e) {
  console.log("CLOSING ISSUE");
  // e.preventDefault();
  // console.log($(this).parent().parent().attr('class'));
  // $(this).parent().parent().remove();
});

$('#post').click(function() {
  var date = getCurrentTime()
  var text = $("#new-issue-text").val()
  if (text.length < 1) {
    if ($('#help-text').is(':hidden')) {
      $('#help-text').toggle();
    }
  } else {
    var newPost =
    `<div class="issue">
      <div class="issue-date">
        <i class="fa fa-times w3-xxlarge close-issue"></i>
        ${date}
      </div>
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

    $('#new-welcome').hide();
    $('#issues-container').prepend(newPost)
    $('#new-issue-text').val("")
    $('body').toggleClass("adding-issue")

    var firebaseRef = firebase.database().ref("posts/")
    firebaseRef.push ({
        post: newPost
      })
  }
});

$('#logout').click(function() {
  firebase.auth().signOut().then(function() {
    window.location = '../index.html'
	}).catch(function(error) {
  		alert("Can not sign out, please try again");
	});
})

function increment(react) {
  react.value = +react.value + 1
  react.innerText = "React 😠 (x" + react.value + ")"
  group_balance = group_balance + penalty_amount
  personal_balance = personal_balance - penalty_amount
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

function onLoad() {
  var firebaseRef = firebase.database().ref("posts/")
  var issuesExist = false
  // Recall database entries
  firebaseRef.once("value", function(snapshot) {
    snapshot.forEach(snap => {
      issuesExist = true
      $('#issues-container').prepend(snap.val().post)
    })
    if (issuesExist) {
      $('#new-welcome').hide();
    } else {
      $('#new-welcome').show();
    }
  }, function(error) {
    console.log("Error: " + error.code)
  })
}
