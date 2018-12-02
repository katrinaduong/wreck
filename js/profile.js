database = firebase.database();
var groups = ['Friendz'];
var deposit = 20;
var penalty = 5;
var loading = 1;
var showedConfirm = false;

$( document ).ready(function() {
  $('#email').val("")
  $('#password').val("")
  $('#groupname').val("")
  $('#sign-up').click(createNewUser)
  $('#login').click(loginUser)
  $('#continue1').click(addGroup)
  $('#continue3').click(sendFirebase)
  $('#create').click(addGroup)
  $('#join').click(addUserToGroup)

  //load groupnames that might be in firebase
	console.log('fetch firebase groups');
	var ref = firebase.database().ref('/groupnames/');
	ref.once("value", function(snapshot) {
		for (var key in snapshot.val()) {
			groups.push(snapshot.val()[key]);        
		}
	}, function (error) {
		console.log("error");
	});

	//load groupdata

  var groupstore = sessionStorage.getItem("groupkey");
	var ref2 = firebase.database().ref('/groups/');
  	ref2.once('value', function(confirmSnapshot) {
  		/*
    	for (var key in confirmSnapshot.val()) {
			console.log(confirmSnapshot.val()[key]);   
 			 var id=confirmSnapshot.val()[key].id;
  			console.log(id);     
		}*/
		confirmSnapshot.forEach(function(childSnapshot) {
	   		 var childKey = childSnapshot.key;
	   		 if (childKey == groupstore){
	    		for (var key in childSnapshot.val()) {
	    			if (key == "penalty")
	    				window.penalty = childSnapshot.val()[key];
	    			if (key == "deposit")
	    				window.deposit = childSnapshot.val()[key];
	    		//console.log(key);
				//console.log(childSnapshot.val()[key]);   
	 			}
	 			if (showedConfirm){
	 				var groupstore = sessionStorage.getItem("groupkey");
	 				document.getElementById("conf-group-name").innerHTML = groupstore;
			    	document.getElementById("deposit-amount").innerHTML = window.deposit;
			   	    document.getElementById("penalty-amount").innerHTML = window.penalty;
			    	showConfirm();
	 			}
 			}
		}, function (error) {
		console.log("error");
		});
	});
}); 
var group_name = "Friendz"

// New User
function createNewUser() {
  console.log("creating new user")
  var email = $('#email').val();
  var name = email.substring(0, email.lastIndexOf("@"));
  sessionStorage.setItem("namekey", name);
  const password = $('#password').val()

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function() {
    window.location = './html/profile1.html'
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

// Login Existing User
function loginUser() {
  const email = $('#email').val()
  const password = $('#password').val()

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function() {
    window.location = './html/issues.html'
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

// Add just the groupname to firebase
function addGroup() {
  console.log("adding group")
  var group = $('#groupname').val();
  sessionStorage.setItem("groupkey", group);
  var groupnames = database.ref('groupnames');  
  var groupname = groupnames.set({name: group});
  window.location = './profile2.html'
}

// Add user to existing group
function addUserToGroup() {
  console.log("adding user to group")
  //check to see if the group exists
  var user_entry = $('#groupname').val();
  var found = false;
  for (var i = 0; i<window.groups.length; i++){
  	if (user_entry == window.groups[i])
  		found = true;
  }
  if (!found /* TODO: check user input against list of groups */) {
    $('#not-group').css("visibility", "visible");
  } else {
    // TODO: valid group so do firebase hooking up to add this user to that group
    $('#not-group').css("visibility", "hidden"); // hide error message we have a valid group

    //add user { group: __ }
  var namestore = sessionStorage.getItem("namekey")
  var users = database.ref('users');  
  var user = users.child(namestore).set({group: user_entry});
  showedConfirm = true;
  //load confirmation page?
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

$('#email-button').on('click', function() { window.location = 'mailto:?subject=Invitation%20to%20Join!&body=Your%20friend%20has%20invited%20you%20to%20join%20the%20roommate%20resolution%20app%20WRECK.%20Go%20to%20http://cs188wreck.herokuapp.com%20and%20join%20the%20group%20called%20' + group_name; });
$('#sms').on('click', function() { window.location = 'sms:?body=Your friend has invited you to join the roommate resolution app WRECK. Go to http://cs188wreck.herokuapp.com and join the group called ' + group_name; });
$('#copy-link').on ('click', function() {
  var copyText = "Your friend has invited you to join the roommate resolution app WRECK. Go to http://cs188wreck.herokuapp.com and join the group called " + group_name;
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(copyText).select();
  document.execCommand("copy");
  alert("Copied the text: " + copyText);
  $temp.remove();
});

//----------- stuff added by melissa ---------------
function sendFirebase() {
	console.log("sending to firebase");
  window.deposit = $('#deposit').val();
  window.penalty = $('#penalty').val();

  var namestore = sessionStorage.getItem("namekey")
  var groupstore = sessionStorage.getItem("groupkey");
  // Make an object with data in it
  var data = {
    balance: window.deposit,
    group: groupstore,
  }

  var users = database.ref('users');  
  var user = users.child(namestore).set(data);

    //add group { ...users: { user... } }
   /* var groups = database.ref('groups');
    var group1 = groups.child(user_entry).set({users: {namestore}})
*/
  var groupdata = {
    groupbalance: "",
    penalty: window.penalty,
    deposit: window.deposit,
    //users: { namestore },
    posts: ""
  }
  var groups2 = database.ref('groups');
  var group3 = groups2.child(groupstore).set(groupdata);
  // Reload the data for the page
  function finished(err) {
    if (err) {
      console.log("ooops, something went wrong.");
      console.log(err);
    } else {
      console.log('Data saved successfully');
    }
  }
}

function showConfirm() {
	var groupstore = sessionStorage.getItem("groupkey");
 console.log("in showConfirm")
  //display confirmation data on profile4
  
  window.location = './profile4.html'
  //groupname, members, deposit, penalty amount
  document.getElementById("conf-group-name").innerHTML = groupstore;
  document.getElementById("deposit-amount").innerHTML = window.deposit;
  document.getElementById("penalty-amount").innerHTML = window.penalty;
  
  console.log("out showConfirm")


}