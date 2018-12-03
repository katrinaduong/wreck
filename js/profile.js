database = firebase.database();
var groups = [''];
var deposit = null;
var penalty = null;
var group_name = "Friendz"
var data_loaded = false;

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
  $('#continue3').click(updateData)
  $('#join').click(updateData)

/*
console.log('fetch firebase groups');
	var ref = firebase.database().ref('/groupnames/');
	ref.on('value', function(function(groupsnapshot) {
		groupsnapshot.forEach(function (snapshot)){
			var gname = snapshot.val();
			console.log(gname);
			window.groups.push(gname);
		}
	});
	*/
  //load groupnames that might be in firebase
	console.log('fetch firebase groups');
	var ref = firebase.database().ref('/groupnames/');
	ref.on("value", function(snapshot) {
		for (var key in snapshot.val()) {
			//TODO: Why aren't all group names getting retrieved?
			console.log(snapshot.val()[key]);
			window.groups.push(snapshot.val()[key]);
		}
	}, function (error) {
		console.log("error");
	});

	//confirmation page
	var groupstore = sessionStorage.getItem("groupkey");
   	var depositstore = sessionStorage.getItem("depositkey");
   	var penaltystore = sessionStorage.getItem("penaltykey");
 	//console.log(groupstore != undefined && depositstore != undefined && penaltystore != undefined);

    //if(groupstore != undefined && depositstore != undefined && penaltystore != undefined) {
    if (window.group_name != null && window.deposit != null && window.penalty != null) {
    	console.log("loading group/deposit/penalty");
    	document.getElementById("conf-group-name").innerHTML = window.group_name;
  	  	document.getElementById("conf-deposit").innerHTML = window.deposit;
      	document.getElementById("conf-penalty").innerHTML = window.penalty;
    }

});

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
  //load confirmation page
  var penaltyRef = firebase.database().ref('/groups/' + user_entry + '/penalty');
  penaltyRef.on('value', function(snapshot) {
	console.log("snapshot.val()\n" + snapshot.val());
	window.penalty = snapshot.val();
	sessionStorage.setItem("penaltykey", snapshot.val());
	var depositRef = firebase.database().ref('/groups/' + user_entry + '/deposit');
  	depositRef.on('value', function(dsnapshot) {
	  console.log("dsnapshot.val()\n" + dsnapshot.val());
	  window.deposit = dsnapshot.val();
	  sessionStorage.setItem("depositkey", dsnapshot.val());
	  window.group_name = user_entry;
	  sessionStorage.setItem("groupkey", user_entry);
	  window.location = './issues.html'
	  console.log("setting html");
	 // $('#conf-group-name').val() = window.group_name;
	 console.log(document.getElementById("conf-group-name").innerHTML);
	 console.log(window.group_name);
    	/*document.getElementById("conf-group-name").innerHTML = window.group_name;
  	  	document.getElementById("conf-deposit").innerHTML = window.deposit;
      	document.getElementById("conf-penalty").innerHTML = window.penalty;
    */
	 /* document.addEventListener('DOMContentLoaded', function() {
   // your code here
   console.log("in addEventListener")
   var groupstore = sessionStorage.getItem("groupkey");
   var depositstore = sessionStorage.getItem("depositkey");
   var penaltystore = sessionStorage.getItem("penaltykey");
 	console.log(groupstore != undefined && depositstore != undefined && penaltystore != undefined);

    if(groupstore != undefined && depositstore != undefined && penaltystore != undefined) {
    	console.log("in window.data_loaded");
    	document.getElementById("conf-group-name").innerHTML = window.group_name;
  	  	document.getElementById("conf-deposit").innerHTML = window.deposit;
      	document.getElementById("conf-penalty").innerHTML = window.penalty;
    }
}, false);*/

    });
  });
}
}
/*
document.addEventListener('DOMContentLoaded', function() {
   // your code here
   console.log("in addEventListener")
   var groupstore = sessionStorage.getItem("groupkey");
   var depositstore = sessionStorage.getItem("depositkey");
   var penaltystore = sessionStorage.getItem("penaltykey");
 	console.log(groupstore != undefined && depositstore != undefined && penaltystore != undefined);

    if(groupstore != undefined && depositstore != undefined && penaltystore != undefined) {
    	console.log("in window.data_loaded");
    	document.getElementById("conf-group-name").innerHTML = window.group_name;
  	  	document.getElementById("conf-deposit").innerHTML = window.deposit;
      	document.getElementById("conf-penalty").innerHTML = window.penalty;
    }
    window.data_loaded = false;
}, false);
*/
//autocomplete
$(function() {
	/*for (i = 0; i < count; i++) {
		groups.push(window.pairs[i]);
	}*/
	$( "#groupname" ).autocomplete({
		source: groups, minLength: 2
	});
});

$('#email-link').on('click', function() { window.location = 'mailto:?subject=Invitation%20to%20Join!&body=Your%20friend%20has%20invited%20you%20to%20join%20the%20roommate%20resolution%20app%20WRECK.%20Go%20to%20http://cs188wreck.herokuapp.com%20and%20join%20the%20group%20called%20' + group_name; });
$('#sms-link').on('click', function() { window.location = 'sms:?body=Your friend has invited you to join the roommate resolution app WRECK. Go to http://cs188wreck.herokuapp.com and join the group called ' + group_name; });
$('#copy-link').on ('click', function() {
  var copyText = "Your friend has invited you to join the roommate resolution app WRECK. Go to http://cs188wreck.herokuapp.com and join the group called " + group_name;
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(copyText).select();
  document.execCommand("copy");
  alert("Copied the text: " + copyText);
  $temp.remove();
});

//create a new group and send all data to firebase
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

function updateData() {
	//TODO: update group balance, personal balance, and penalty
	var num_roommates = 4;	//need to count roommates

    if (window.deposit != null && window.penalty != null) {
	  	document.getElementById("group-balance").innerHTML = window.deposit*num_roommates;
	    document.getElementById("personal-balance").innerHTML = window.deposit;	//need to make this subtract penalties
	    document.getElementById("penalty-balance").innerHTML = window.penalty;
	}
}