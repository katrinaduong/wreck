
$( document ).ready(function() {
  $('#email').val("")
  $('#password').val("")
  $('#groupname').val("")
  $('#sign-up').click(createNewUser)
  $('#login').click(loginUser)
  $('#continue1').click(addGroup)
});

// New User
function createNewUser() {
  console.log("creating new user")
  const email = $('#email').val()
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
    } else if (errorCode === 'auth/wrong-password') {
      alert('Wrong password.')
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
    window.location = './html/profile1.html'
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

// Add group name to firebase
function addGroup() {
  console.log("adding group")
  firebase.database().ref("groups/" + $('#groupname').val()).set({
    member: "me"
  })

  window.location = './profile2.html'
}
