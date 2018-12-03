var roommates = [
{"name":"Ayush","paid":9},
{"name":"Hannah","paid":5},
{"name":"Katrina","paid":3},
{"name":"Melissa","paid":10},
{"name":"Sam","paid":2}
]
// Load google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);
google.charts.setOnLoadCallback(drawLineChart);

// Draw the chart and set the chart values
function drawChart() {
	var data = google.visualization.arrayToDataTable([
		['Roommate', 'Total contribution'],
		[roommates[0].name, roommates[0].paid],
		[roommates[1].name, roommates[1].paid],
		[roommates[2].name, roommates[2].paid],
		[roommates[3].name, roommates[3].paid],
		[roommates[4].name, roommates[4].paid]
		]);
//TODO - not sure how data will look in firebase but this will have to change

// Optional; add a title and set the width and height of the chart
var options = {
	'width':1000,
	'height':800,
	'fontSize':20,
	'pieHole':0.4,
	'pieSliceText':'label',
	'legend': 'none',
	'title':'Individual Contributions',
	'titleTextStyle': { color: 'black',
	fontSize: 30,
	bold: false,
	italic: false }
};

// Display the chart inside the <div> element with id="piechart"
var chart = new google.visualization.PieChart(document.getElementById('piechart'));
chart.draw(data, options);
}

//populate the table
//TODO make the table actually show up
/*
var table = document.getElementById("amounts");
var row = table.insertRow(1);
//add 3 cells
var cell1 = row.insertCell(0);
var cell2 = row.insertCell(1);
cell1.innerHTML = roommate[i];
cell2.innerHTML = paid[i];
*/


//It would be cool if both charts would show on a page
function drawLineChart() {

  var ldata = new google.visualization.DataTable();
  ldata.addColumn('number', 'Day');
  ldata.addColumn('number', 'Ayush');
  ldata.addColumn('number', 'Hannah');
  ldata.addColumn('number', 'Katrina');

  ldata.addRows([
    [1,  37.8, 80.8, 41.8],
    [2,  30.9, 69.5, 32.4],
    [3,  25.4,   57, 25.7],
    [4,  11.7, 18.8, 10.5],
    [5,  11.9, 17.6, 10.4],
    [6,   8.8, 13.6,  7.7],
    [7,   7.6, 12.3,  9.6],
    [8,  12.3, 29.2, 10.6],
    [9,  16.9, 42.9, 14.8],
    [10, 12.8, 30.9, 11.6],
    [11,  5.3,  7.9,  4.7],
    [12,  6.6,  8.4,  5.2],
    [13,  4.8,  6.3,  3.6],
    [14,  4.2,  6.2,  3.4]
  ]);

  var loptions = {
  	fontSize:20,
    chart: {
      title: 'Amounts Paid Over Time',
      subtitle: 'for the month of November'
    },
    width: 900,
    height: 500
  };

  var lchart = new google.charts.Line(document.getElementById('linechart'));

  lchart.draw(ldata, google.charts.Line.convertOptions(loptions));
}