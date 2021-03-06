database = firebase.database();
// Glogbals
var group_name = ""
var user_name = ""
var groups = [''];
var deposit = null;
var penalty = null;
var data_loaded = false;

$( document ).ready(function() {
	$('#username').val("")
	$('#email').val("")
	$('#password').val("")
	$('#password-confirm').val("")
	$('#groupname').val("")
	$('#sign-up-back').click(navigateHome)
	$('#sign-up-start').click(navigateSignup)
	$('#sign-up').click(createNewUser)
	$('#login-back').click(navigateHome)
	$('#login-start').click(navigateLogin)
	$('#login').click(loginUser)
	// $('#continue1').click(addGroup)
	$('#continue3').click(sendFirebaseGroup)
	$('#create').click(addGroup)
	$('#join').click(addUserToGroup)
  //$('#continue3').click(updateData)
  //$('#join').click(updateData)

  //load groupnames that might be in firebase
  var ref = firebase.database().ref('/groupnames/');
  ref.on("value", function(snapshot) {
  	for (var key in snapshot.val()) {
  		window.groups.push(snapshot.val()[key]);
  	}
  }, function (error) {
  	console.log("error");
  });

	//confirmation page
	var groupstore = sessionStorage.getItem("groupkey");
	var depositstore = sessionStorage.getItem("depositkey");
	var penaltystore = sessionStorage.getItem("penaltykey");

    //if(groupstore != undefined && depositstore != undefined && penaltystore != undefined) {
    	if (window.group_name != null && window.deposit != null && window.penalty != null) {
    		document.getElementById("conf-group-name").innerHTML = window.group_name;
    		document.getElementById("conf-deposit").innerHTML = window.deposit;
    		document.getElementById("conf-penalty").innerHTML = window.penalty;
    	}

});

function navigateHome() {
	sessionStorage.clear()
	window.location = '../index.html'
}

function navigateSignup() {
	sessionStorage.clear()
	window.location = './html/signup.html'
}

function navigateLogin() {
	sessionStorage.clear()
	window.location = './html/login.html'
}

// New User
function createNewUser() {
	var email = $('#email').val();
	window.user_name = $('#username').val();
	sessionStorage.setItem("emailkey", email);
	sessionStorage.setItem("namekey", window.user_name);

	const password = $('#password').val()
	const passwordConfirm = $('#password-confirm').val()
	if (password !== passwordConfirm) {
		alert('Passwords do not match!')
	} else {
		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then(function() {
			window.location = '../html/profile1.html'
		})
		.catch(function(error) {
			var errorCode = error.code
			var errorMessage = error.message

			if (password.length < 6) {
				alert('Password must be at least 6 characters long.')
			} else if (errorCode === 'auth/invalid-email') {
				alert('Invalid email.')
			} else if (errorCode === 'auth/email-already-in-use') {
				alert('The email address is already in use by another account.')
			} else {
				alert(error.message)
			}
		});
	}
}

// Login Existing User
function loginUser() {
	const email = $('#email').val()
	const password = $('#password').val()

	firebase.auth().signInWithEmailAndPassword(email, password)
	.then(function() {
		var usersRef = firebase.database().ref('/users/')
		usersRef.on("value", function(snapshot) {
	  	for (var key in snapshot.val()) {
	  		if (snapshot.val()[key]["email"] === email) {
					// Retrieve the username from the email
					window.user_name = key
					var username = window.user_name
					var groupRef = firebase.database().ref('/users/' + username + '/group')
					groupRef.on('value', function(snapshot) {
						// Retrieve the groupname from the username
						window.group_name = snapshot.val();
						sessionStorage.setItem("groupkey", window.group_name)
						sessionStorage.setItem("namekey", window.user_name)
						window.location = '../html/issues.html'
					})

				}
	  	}
	  }, function (error) {
	  	console.log("error");
	  });
	})
	.catch(function(error) {
		var errorCode = error.code
		var errorMessage = error.message

		if (errorCode === 'auth/wrong-password') {
			alert('Wrong password.')
		} else if (errorCode === 'auth/invalid-email') {
			alert('Invalid email.')
		} else if (errorCode === 'user-not-found') {
			alert('User not found.')
		} else {
			alert(error.message)
		}

	});

}

// Add just the groupname to firebase (for autocomplete)
function addGroup() {
	window.group_name = $('#groupname').val();
	sessionStorage.setItem("groupkey", window.group_name);
	var groupnames = database.ref('groupnames');
	var groupname = groupnames.child(window.group_name).set(window.group_name);
	window.location = './profile2.html'
}

// Add user to existing group
function addUserToGroup() {
  // Check to see if the group exists
  var inputGroupName = $('#groupname').val();
  var found = false;
  for (var i = 0; i<window.groups.length; i++){
  	if (inputGroupName == window.groups[i])
  		found = true;
  }
  if (!found) {
  	$('#not-group').css("visibility", "visible");
  } else {
    // TODO: valid group so do firebase hooking up to add this user to that group
    $('#not-group').css("visibility", "hidden"); // hide error message we have a valid group
    // Get username
		window.group_name = inputGroupName
		sessionStorage.setItem("groupkey", window.group_name);
    window.user_name = sessionStorage.getItem("namekey");
    var emailstore = sessionStorage.getItem("emailkey");
    var depositstore = null;

    // Get deposit for user balance and to update groupbalance
    var depositRef = firebase.database().ref('/groups/' + window.group_name +'/deposit');
    depositRef.on('value', function(snapshot) {
    	depositstore = snapshot.val();
	    var data = {
	    	balance: depositstore,
        email: emailstore,
	    	group: window.group_name,
	    }
	    var users = database.ref('users');
	    var user = users.child(window.user_name).set(data);

			//add user to group
      //groups
      //	user_entry
      //		users
      //			usernamestore
      var userRef = firebase.database().ref('/groups/' + window.group_name + '/users/');
      userRef.on('value', function(snapshot) {
      	var user = userRef.child(window.user_name).set(window.user_name);
				window.location = './issues.html';	//this needs to be here or else the page switches before the data is stored in firebase D':
      }, function (error) {
      	console.log("error");
      });
		}, function (error) {
  		console.log("error");
  	});
 }
}

//autocomplete
$(function() {
	/*for (i = 0; i < count; i++) {
		groups.push(window.pairs[i]);
	}*/
	$( "#groupname" ).autocomplete({
		source: groups, minLength: 2
	});
});

$('#email-link').on('click', function() { window.location = 'mailto:?subject=Invitation%20to%20Join!&body=Your%20friend%20has%20invited%20you%20to%20join%20the%20roommate%20resolution%20app%20WRECK.%20Go%20to%20http://cs188wreck.herokuapp.com%20and%20join%20the%20group%20called%20' + window.group_name; });
$('#sms-link').on('click', function() { window.location = 'sms:?body=Your friend has invited you to join the roommate resolution app WRECK. Go to http://cs188wreck.herokuapp.com and join the group called ' + window.group_name; });
$('#copy-link').on ('click', function() {
	var copyText = "Your friend has invited you to join the roommate resolution app WRECK. Go to http://cs188wreck.herokuapp.com and join the group called " + group_name;
	var $temp = $("<input>");
	$("body").append($temp);
	$temp.val(copyText).select();
	document.execCommand("copy");
	alert("Copied the text: " + copyText);
	$temp.remove();
});

function sendFirebaseNewUser() {
	//pull group data

}
//create a new group and send all data to firebase
function sendFirebaseGroup() {
	window.deposit = $('#deposit').val();
	window.penalty = $('#penalty').val();

	var namestore = sessionStorage.getItem("namekey");
	var groupstore = sessionStorage.getItem("groupkey");
  var emailstore = sessionStorage.getItem("emailkey");

 //users
//  username: usernamestore
//      balance: depositstore
//      email: emailstore
//      group: user_entry
// var depositstore = sessionStorage.getItem("depositkey");
	var data = {
	    balance: window.deposit,
	    email: emailstore,
	    group: groupstore,
	}
	var users = database.ref('users');
	var user = users.child(namestore).set(data);

	//add the group to firebase
	var groupdata = {
		groupbalance: 0,
		penalty: window.penalty,
		deposit: window.deposit,
		users: { namestore },
		posts: ""
	}
	var groups2 = database.ref('groups');
	var group3 = groups2.child(groupstore).set(groupdata);

	window.location = './issues.html'
  // Reload the data for the page
  function finished(err) {
  	if (err) {
  		console.log("Oops, something went wrong.");
  		console.log(err);
  	} else {
  		console.log('Data saved successfully');
  	}
  }
}

// function updateData() {
// 	//TODO: update group balance, personal balance, and penalty
// 	var num_roommates = 4;	//need to count roommates
// 	console.log("in updateData");
// 	if (window.deposit != null && window.penalty != null) {
// 		document.getElementById("group-balance").innerHTML = window.deposit*num_roommates;
// 	    document.getElementById("personal-balance").innerHTML = window.deposit;	//need to make this subtract penalties
// 	    document.getElementById("penalty-balance").innerHTML = window.penalty;
// 	}
// }
