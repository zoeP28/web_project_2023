// Fetch monthly user data from the server
$.post("./php/montlyScores.php").done(function (data) {
  displayTable(data);
});

// Display data in Bootstrap Table
function displayTable(data) {
  $('#leaderBoard').bootstrapTable({
    data: data,
    columns: [{
      field: 'username',
      title: 'User',
      sortable: true
    }, {
      field: 'overallScore',
      title: 'Score',
      sortable: true
    }, {
      field: 'tokens',
      title: 'Monthly Tokens',
      sortable: true
    }, {
      field: 'overallTokens',
      title: 'Tokens - overall',
      sortable: true
    }]
  });
}
