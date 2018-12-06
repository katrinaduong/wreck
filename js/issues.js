// Globals
var group_name = ""
var user_name = ""
var usernames = [''];
var group_balance = 0.00
var personal_balance = 0.00
var penalty_amount = 0.00
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

$( document ).ready(function() {

	$('#logout').click(logoutUser)
  //confirmation page
	window.group_name = sessionStorage.getItem("groupkey");
  window.user_name = sessionStorage.getItem("namekey");
	updateBalances()

  // Cache usernames
  var ref = firebase.database().ref('/groups/' + window.group_name + '/users');
  ref.on("value", function(snapshot) {
  	for (var key in snapshot.val()) {
  		window.usernames.push(snapshot.val()[key]);
  	}
  }, function (error) {
  	console.log("error");
  });

  $('#issues-title').html(window.group_name + '\'s Issues ')

});

// Login Existing User
function logoutUser() {
	firebase.auth().signOut().then(function() {
	  console.log("Log out successful")
	}, function(error) {
	  console.log("Error: " + error);
	});
}

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
  $('#group-balance').html("$" + parseFloat(window.group_balance).toFixed(2));
  $('#personal-balance').html("$" + parseFloat(window.personal_balance).toFixed(2));
  $('#penalty-balance').html("$" + parseFloat(window.penalty_amount).toFixed(2));
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
        <i onclick="delete_issue(this)" class="fa fa-times w3-xxlarge close-issue"></i>
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
		$('#dashboard').hide();
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

function delete_issue(current) {
	var topLevel = current.parentNode.parentNode.parentNode
	var element = current.parentNode.parentNode;
	element.remove();
	if(!topLevel.hasChildNodes()) {
		$('#dashboard').show()
	}
	// TODO3: delete from firebase
}

function react(react) {
  //retrieve person tagged in issue
  var taggedName = "";
  var mess = react.parentNode.parentNode.parentNode.innerHTML;
  var start = mess.indexOf("@");
  var end = mess.indexOf("<", start);
  var taggedName = mess.substring(start+1, end);
  //make sure person isn't reacting to their own issue
  if (taggedName == window.user_name) {
    console.log("You can't react to your own issue, silly!");
    //TODO1: some sort of visual feedback to the user
  } else {
    //increase group balance by penalty_amount
		window.group_balance = +window.group_balance + +window.penalty_amount;

    //reduce balance of tagged person by penalty_amount (unless it's already 0)
    var taggedBalanceRef = firebase.database().ref('/users/' + taggedName + '/balance')
    taggedBalanceRef.once('value', function(snapshot) {
	  	var oldTaggedBalance = snapshot.val();
	  	newTaggedBalance = +oldTaggedBalance - window.penalty_amount;
	    if (newTaggedBalance < 0){
	      newTaggedBalance = 0;
	    }

			// Update balances in firebase
			var groupBalanceRef = firebase.database().ref('/groups/' + window.group_name + '/groupbalance')
			groupBalanceRef.set(window.group_balance)
      taggedBalanceRef.set(newTaggedBalance);
    })

    //increment reacts and display
    react.value = +react.value + 1
    react.innerText = "React 😠 (x" + react.value + ")"

		// TODO2: replace old post's html with new post's html (so that all users can see how many reacts)
  }
}

function updateBalances() {
	var groupBalanceRef = firebase.database().ref('/groups/' + window.group_name +'/groupbalance')
	var personalBalanceRef = firebase.database().ref('/users/' + window.user_name + '/balance')
	var penaltyRef = firebase.database().ref('/groups/' + window.group_name +'/penalty')
	groupBalanceRef.on('value', function(snapshot) {
		window.group_balance = snapshot.val();
	})
	personalBalanceRef.on('value', function(snapshot) {
		window.personal_balance = snapshot.val();
	})
	penaltyRef.on('value', function(snapshot) {
		window.penalty_amount = snapshot.val();
	})
}

function onLoad() {
	window.group_name = sessionStorage.getItem("groupkey");
  window.user_name = sessionStorage.getItem("namekey");
	updateBalances();
  var firebaseRef = firebase.database().ref('/groups/' + window.group_name + '/posts/')
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
