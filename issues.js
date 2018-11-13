//
// $('.issue-button').click(function(){
//   $(this).toggleClass('issue-button-clicked');
// });

$('#add-issue').click(function() {
  $("body").toggleClass("adding-issue");
});

$('#nevermind, .close-button').click(function() {
  $("body").toggleClass("adding-issue");
});
