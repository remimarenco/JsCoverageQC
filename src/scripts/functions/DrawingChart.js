'use strict';

var React = require('react/addons');

var DrawingChart = React.createClass({
    componentDidMount: function(){

    },
    render: function(){
        return(
            <span>
                Chart coming soon...
            </span>
        );
    }
});

module.exports = DrawingChart;

/* Beginning ----
var chartWidth;
google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(function() {
$(document).ready(function() {

// set up read count histograms
$(".readHistogram").each(function() {
$(this).css("background-position", "0px " + ((1.0 * (100 - parseInt($(this).attr("data-pct")))) / 100) * $(this).outerHeight() + "px");
});

// engage the tablesorter
$("#qcReportTable").tablesorter({
headers: {
0: { sorter:false },
1: { sorter:false },
2: { sorter:false },
3: { sorter:false },
4: { sorter:"text" },
5: { sorter:"text" },
6: { sorter:"text" },
7: { sorter:"text" },
8: { sorter:"text" },
9: { sorter:"text" },
10: { sorter:"text" },
11: { sorter:"text" },
}
});
            
// expand all takes so long that a modal "wait..." is displayed
$("#geneExonExpandCollapseAllButton").bind("click", function() {
if($(this).html() == "+") {
$(this).html("-");
$(".geneExonExpandCollapseButton").html("-");
$("#blocker").show();
$(".geneExon_child").show();
setTimeout(function() {
var geneExonPos = 1;
$(".geneExon_child").each(function() {
eval("geneExon" + geneExonPos + "_drawChart()");
geneExonPos++;
});
$("#blocker").hide();
}, 10);
}
else {
$(this).html("+");
$(".geneExonExpandCollapseButton").html("+");
$(".geneExon_child").hide();
}
return false;
});

$(".geneExonExpandCollapseButton").bind("click", function() {
$("." + $(this).attr('id') + "_child").toggle();
if($(this).html() == "+") {
$(this).html("-");
eval($(this).attr('id') + "_drawChart()");
}
else {
$(this).html("+");
}
return false;

});

$("#exportLink").bind("click", function() {
showExportDialog();
return false;
});

});
});
*/