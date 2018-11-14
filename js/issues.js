
// $('.issue-button').click(function(){
//   $(this).toggleClass('issue-button-clicked');
// });

$('#add-issue').click(function() {
  $("body").toggleClass("adding-issue");
});

$('#nevermind, .close-button').click(function() {
  $("#new-issue-text").val('');
  $("body").toggleClass("adding-issue");
});

// $('#post').click(function() {
//   // <div class="issue">
//   //   <div class="issue-date">NOVEMBER 18, 2018</div>
//   //   <label class="issue-content">Ayush, you have been leaving your dishes in the sink the past 3 days. Can you please clean up?</label>
//   //   <hr>
//   //   <div class="issue-footer">
//   //     <div class="issue-reply issue-button">
//   //       <i class="fa fa-reply"></i>
//   //       Reply
//   //     </div>
//   //     <div class="issue-react-angry issue-button">
//   //       React 😠 <label class="angry-count"></label>
//   //     </div>
//   //   </div>
//   // </div>
// });
