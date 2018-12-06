
var usernames = [''];
// $('.issue-button').click(function(){
//   $(this).toggleClass('issue-button-clicked');
// });
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var personal_balance = 20.00
var group_balance = 0.00
var penalty_amount = 5.00


$( document ).ready(function() {

  //confirmation page
	var group = sessionStorage.getItem("groupkey");
  var name = sessionStorage.getItem("namekey");
	var deposit = sessionStorage.getItem("depositkey");
	var penalty = sessionStorage.getItem("penaltykey");
  console.log(group + " " + name + " " + deposit + " " + penalty)

  // Cache usernames
  var ref = firebase.database().ref('/groups/' + group + '/users');
  ref.on("value", function(snapshot) {
  	for (var key in snapshot.val()) {
  		console.log(snapshot.val()[key]);
  		window.usernames.push(snapshot.val()[key]);
  	}
  }, function (error) {
  	console.log("error");
  });

  $('#issues-title').html(group + '\'s Issues ')

});

$('#add-issue').click(function() {
  $("#new-issue-text").focus();
  $("body").toggleClass("adding-issue");
  $("new-issue-text").focus();
});

// autocomplete
$(function() {
	$("#roommate-tag").autocomplete({
		source: usernames, minLength: 1,
    select: function (event, ui) {
      $("#roommate-tag").val(ui.item.value);
      return false;
    },
    messages: {
      noResults: '',
      results: function() {
        console.log(this.results);
      }
  }
	});
});

$('#menu').click(function() {
  $('#sidebar').css("left", "0");
  $('#sidebar').css("transition", "1s");
  $('#dark-blur').css("visibility", "visible");
  $('#group-balance').html("$" + parseFloat(group_balance).toFixed(2));
  $('#personal-balance').html("$" + parseFloat(personal_balance).toFixed(2));
  $('#penalty-balance').html("$" + parseFloat(penalty_amount).toFixed(2));
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
  var tag = $('#roommate-tag').val()
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
      <div class="issue-tag">@${tag}</div>
      <label class="issue-content">${text}</label>
      <hr>
      <div class="issue-footer">
        <div class="issue-react-angry issue-button">
          <button id="issue-button-text" onclick="react(this)" value="0">
            React 😠 <label class="angry-count"></label>
          </button>
        </div>
      </div>
    </div>`

    $('#new-welcome').hide();
    $('#issues-container').prepend(newPost)
    $('#new-issue-text').val("")
    $('body').toggleClass("adding-issue")

    var group = sessionStorage.getItem("groupkey");
    var firebaseRef = firebase.database().ref('/groups/' + group + '/posts')
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

function react(react) {
  var id = react.parentNode.parentNode.parentNode.getAttribute("class");
  console.log(id)
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
  var group = sessionStorage.getItem("groupkey");
  var firebaseRef = firebase.database().ref('/groups/' + group + '/posts/')
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
