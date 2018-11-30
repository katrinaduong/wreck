database = firebase.database();

$( document ).ready(function() {
  $('#email').val("")
  $('#password').val("")
  $('#groupname').val("")
  $('#sign-up').click(createNewUser)
  $('#login').click(loginUser)
  $('#continue1').click(addGroup)
  $('#continue3').click(sendFirebase)
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

// Store group name in session
function addGroup() {
  console.log("adding group")
  var group = $('#groupname').val();
  sessionStorage.setItem("groupkey", group);

  window.location = './profile2.html'
}

// Add user to existing group
function addUserToGroup() {
  var user_entry = $('groupname').val();
  if (true /* TODO: check user input against list of groups */) {
    $('#not-group').css("visibility", "visible");
  } else {
    // TODO: valid group so do firebase hooking up to add this user to that group
    $('#not-group').css("visibility", "hidden"); // hide error message we have a valid group

  }
}

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
  deposit = $('#deposit').val();
  penalty = $('#penalty').val();

  var namestore = sessionStorage.getItem("namekey")
  var groupstore = sessionStorage.getItem("groupkey");
  // Make an object with data in it
  var data = {
    balance: deposit,
    group: groupstore,
  }

  var users = database.ref('users');  
  var user = users.child(namestore).set(data);

  var groupdata = {
    groupbalance: "",
    penalty: penalty,
    deposit: deposit,
    users: { namestore },
    posts: ""
  }
  var groups = database.ref('groups');
  var group = groups.child(groupstore).set(groupdata);
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