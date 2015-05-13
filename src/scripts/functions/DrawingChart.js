'use strict';

var React = require('react/addons');

var DrawingChart = React.createClass({
    componentWillMount: function(){
        this.geneExonPositionId = 'geneExon'+ this.props.position;
        this.geneExonPositionIdDiv = this.geneExonPositionId + '_div';
    },
    componentDidMount: function(){
        if(this.geneExonPositionIdDiv === 'geneExon1_div'){
            /* jshint ignore:start */
            debugger;
            /* jshint ignore:end */
        }

        var self = this;
        var geneExonBases = this.props.geneExon.bases;
        var geneExonBins = this.props.geneExon.bins;
        // draw chart using Google Charts
        var rows = [];
        geneExonBases.forEach(function(base, index){
            rows.push(
                {c:
                    [
                    {v: base.pos},
                    {v: base.variant},
                    {v: base.variantText},
                    {v: base.getTotalReadDepth()},
                    {v: geneExonBins[geneExonBins.length - 1].startCount}
                    ]
                });
        });
        var data = {
        cols:[
        {id:'pos', label:'pos', type:'number'},
        {type:'string', role:'annotation'},
        {type:'string', role:'annotationText'},
        {id:'readDepth', label:'reads', type:'number'},
        {id:'qcThreshold', label:'QC level', type:'number'}
        ],
        rows: rows};
        /* jshint ignore:start */
        var dataTable = new google.visualization.DataTable(data);
        var dataView = new google.visualization.DataView(dataTable);
        var chart = new google.visualization.LineChart(React.findDOMNode(this.refs[this.geneExonPositionIdDiv]));
        chart.draw(dataView, { colors: ['blue', 'red'], annotations: { style: 'line' } });
        /* jshint ignore:end */

        // add the amplicon guides to chart (custom SVG)
        var amplicons = [];
        /*
        <xsl:for-each select="amplicons/amplicon">
            <xsl:if test="position() != 1">,</xsl:if>{name:'<xsl:value-of select="@name"/>', startPos:<xsl:value-of select="@startPos"/>, endPos:'<xsl:value-of select="@endPos"/>'}
        </xsl:for-each>
        */
        this.props.geneExon.amplicons.forEach(function(amplicon){
            amplicons.push({
                name: amplicon.name,
                startPos: amplicon.startPos,
                endPos: amplicon.endPos
            });
        });

        // Find a better solution than using jQuery
        /* jshint ignore:start */
        var svg = $('#' + this.geneExonPositionIdDiv + ' svg');
        var svgHeight = parseInt(svg.css('height')) + (30 * amplicons.length);
        var chartBoundingBox = chart.getChartLayoutInterface().getChartAreaBoundingBox();
        var xScale =  (1.0 * chartBoundingBox.width) / (1.0 *
            (geneExonBases.values()[geneExonBases.length - 1].pos - geneExonBases.values()[0].pos))
        $('#' + this.geneExonPositionIdDiv +  '>:first-child').css({ height:svgHeight + 'px' });
        $('#' + this.geneExonPositionIdDiv + ' svg').css({ height:svgHeight + 'px' });
        var g = this.a(svg, 'g', { class:'amplicons', transform:'translate(' + chartBoundingBox.left + ' ' + (svgHeight - (30 * amplicons.length) - 10) + ') scale(' + xScale + ' 1)' });
        for(var x = 0; x < amplicons.length; x++) {
            var y = 30 * x;
            var color;
            if(amplicons[x].name.match(/^.*_coding$/) != null) {
                color = 'green';
            }
            else if(amplicons[x].name.match(/^.*_Lung$/) != null){
                color = 'red'
            }
            else {
                color = 'gray';
            }

            if((amplicons[x].startPos >= geneExonBases.values()[0].pos) && (amplicons[x].endPos <= geneExonBases.values()[geneExonBases.length - 1].pos)) {
                this.a(g, 'rect', { x:(amplicons[x].startPos - geneExonBases.values()[0].pos), y:y, width:(amplicons[x].endPos - amplicons[x].startPos), height:'25', opacity:'0.5', style:'fill: ' + color + ';' });
                this.a(g, 'rect', { x:(amplicons[x].startPos - geneExonBases.values()[0].pos), y:'-' + (svgHeight - 90), width:'1', height:(svgHeight - 90 + y), opacity:'0.5', style:'fill: ' + color + ';' });
                this.a(g, 'rect', { x:(amplicons[x].endPos - geneExonBases.values()[0].pos - 1), y:'-' + (svgHeight - 90), width:'1', height:(svgHeight - 90 + y), opacity:'0.5', style:'fill: ' + color + ';' });
                this.a(g, 'text', { x:(((amplicons[x].startPos - geneExonBases.values()[0].pos) * xScale) + 5), y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = amplicons[x].name;
            }
            else if((amplicons[x].startPos < geneExonBases.values()[0].pos) && (amplicons[x].endPos <= geneExonBases.values()[geneExonBases.length - 1].pos)) {
                this.a(g, 'rect', { x:'0', y:y, width:(amplicons[x].endPos - geneExonBases.values()[0].pos), height:'25', opacity:'0.5', style:'fill: ' + color + ';' });
                this.a(g, 'rect', { x:(amplicons[x].endPos - geneExonBases.values()[0].pos - 1), y:'-' + (svgHeight - 90), width:'1', height:(svgHeight - 90 + y), opacity:'0.5', style:'fill: ' + color + ';' });
                this.a(g, 'polygon', { points:'0,' + y + ' 0,' + (y + 25) + ' -25,' + (y + 12), transform:'scale(' + (1 / xScale) + ' 1)', opacity:'0.5', style:'fill: ' + color + ';' });
                this.a(g, 'text', { x:'-75', y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = (geneExonBases.values()[0].pos - amplicons[x].startPos) + " bp";
                this.a(g, 'text', { x:'5', y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = amplicons[x].name;
            }
            else if((amplicons[x].startPos >= geneExonBases.values()[0].pos) && (amplicons[x].endPos > geneExonBases.values()[0].pos)) {
                this.a(g, 'rect', { x:(amplicons[x].startPos - geneExonBases.values()[0].pos), y:y, width:(geneExonBases.values()[0].pos - amplicons[x].startPos), height:'25', opacity:'0.5', style:'fill: ' + color + ';' });
                this.a(g, 'rect', { x:(amplicons[x].startPos - geneExonBases.values()[0].pos), y:'-' + (svgHeight - 90), width:'1', height:(svgHeight - 90 + y), opacity:'0.5', style:'fill: ' + color + ';' });
                this.a(g, 'polygon', { points:chartBoundingBox.width + ',' + y + ' ' + chartBoundingBox.width + ',' + (y + 25) + ' ' + (chartBoundingBox.width + 25) + ',' + (y + 12), transform:'scale(' + (1 / xScale) + ' 1)', opacity:'0.5', style:'fill: ' + color + ';' });
                this.a(g, 'text', { x:(chartBoundingBox.width + 27), y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = (amplicons[x].endPos - geneExonBases.values()[geneExonBases.length - 1].pos) + " bp";
                this.a(g, 'text', { x:(((amplicons[x].startPos - geneExonBases.values()[0].pos) * xScale) + 5), y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = amplicons[x].name;
            }
            else if((amplicons[x].startPos < geneExonBases.values()[0].pos) && (amplicons[x].endPos > geneExonBases.values()[geneExonBases.length - 1].pos)) {
                this.a(g, 'rect', { x:'0', y:y, width:(geneExonBases.values()[geneExonBases.length - 1].pos - geneExonBases.values()[0].pos), height:'25', opacity:'0.5', style:'fill: ' + color + ';' });
                this.a(g, 'polygon', { points:'0,' + y + ' 0,' + (y + 25) + ' -25,' + (y + 12), transform:'scale(' + (1 / xScale) + ' 1)', opacity:'0.5', style:'fill: ' + color + ';' });
                this.a(g, 'text', { x:'-75', y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = (geneExonBases.values()[0].pos - amplicons[x].startPos) + " bp";
                this.a(g, 'polygon', { points:chartBoundingBox.width + ',' + y + ' ' + chartBoundingBox.width + ',' + (y + 25) + ' ' + (chartBoundingBox.width + 25) + ',' + (y + 12), transform:'scale(' + (1 / xScale) + ' 1)', opacity:'0.5', style:'fill: ' + color + ';' });
                this.a(g, 'text', { x:(chartBoundingBox.width + 27), y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = (amplicons[x].endPos - geneExonBases.values()[geneExonBases.length - 1].pos) + " bp";
                this.a(g, 'text', { x:'5', y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = amplicons[x].name;
            }
        }
        /* jshint ignore:end */
    },
    shouldComponentUpdate: function(){
        return false; // Equivalent to the old code :
        // // don't draw the chart if it has already been drawn
        /*
        if($("#geneExon<xsl:value-of select="position()"/>_div svg").length > 0) {
            return;
        }
         */
    },
    render: function(){
        return(
            <div id={this.geneExonPositionIdDiv} ref={this.geneExonPositionIdDiv}>
            </div>
        );
    },

    a: function(parentElement, element, eldict){
        /* jshint ignore:start */
        var el = $(document.createElementNS('http://www.w3.org/2000/svg', element));
        el.attr(eldict).appendTo(parentElement);
        return el;
        /* jshint ignore:end */
    }
});

module.exports = DrawingChart;

/* Draw Chart function / For each row
function geneExon<xsl:value-of select="position()"/>_drawChart() {

function a(parentElement, element, eldict) { 
el = $(document.createElementNS('http://www.w3.org/2000/svg', element));
el.attr(eldict).appendTo(parentElement);
return el;
}

// don't draw the chart if it has already been drawn
if($("#geneExon<xsl:value-of select="position()"/>_div svg").length > 0) {
return;
}

// draw chart using Google Charts
var data = {
cols:[
{id:'pos', label:'pos', type:'number'}
,{type:'string', role:'annotation'}
,{type:'string', role:'annotationText'}
,{id:'readDepth', label:'reads', type:'number'}
,{id:'qcThreshold', label:'QC level', type:'number'}
]
,rows:[
<xsl:for-each select="bases/base">
    <xsl:if test="position() != 1">,</xsl:if>{c:[{v:<xsl:value-of select="@pos"/>}, {v:'<xsl:value-of select="@variant"/>'}, {v:'<xsl:value-of select="@variantText"/>'}, {v:<xsl:value-of select="@totalReadDepth"/>}, {v:<xsl:value-of select="../../bins/bin[last()]/@startCount"/>}]}
</xsl:for-each>
]};
var dataTable = new google.visualization.DataTable(data);
var dataView = new google.visualization.DataView(dataTable);
var chart = new google.visualization.LineChart(document.getElementById('geneExon<xsl:value-of select="position()"/>_div'));
chart.draw(dataView, { colors: ['blue', 'red'], annotations: { style: 'line' } });

// add the amplicon guides to chart (custom SVG)
var amplicons = [
<xsl:for-each select="amplicons/amplicon">
    <xsl:if test="position() != 1">,</xsl:if>{name:'<xsl:value-of select="@name"/>', startPos:<xsl:value-of select="@startPos"/>, endPos:'<xsl:value-of select="@endPos"/>'}
</xsl:for-each>
];
var svg = $('#geneExon<xsl:value-of select="position()"/>_div svg');
var svgHeight = parseInt(svg.css('height')) + (30 * amplicons.length);
var chartBoundingBox = chart.getChartLayoutInterface().getChartAreaBoundingBox();
var xScale =  (1.0 * chartBoundingBox.width) / (1.0 * (<xsl:value-of select="bases/base[last()]/@pos"/> - <xsl:value-of select="bases/base[1]/@pos"/>));
$('#geneExon<xsl:value-of select="position()"/>_div >:first-child').css({ height:svgHeight + 'px' });
$('#geneExon<xsl:value-of select="position()"/>_div svg').css({ height:svgHeight + 'px' });
var g = a(svg, 'g', { class:'amplicons', transform:'translate(' + chartBoundingBox.left + ' ' + (svgHeight - (30 * amplicons.length) - 10) + ') scale(' + xScale + ' 1)' });
for(var x = 0; x &lt; amplicons.length; x++) {
var y = 30 * x;
var color
if(amplicons[x].name.match(/^.*_coding$/) != null) {
color = 'green';
}else if(amplicons[x].name.match(/^.*_Lung$/) != null){color = 'red'}
else {
color = 'gray';
}
if((amplicons[x].startPos >= <xsl:value-of select="bases/base[1]/@pos"/>) &amp;&amp; (amplicons[x].endPos &lt;= <xsl:value-of select="bases/base[last()]/@pos"/>)) {
a(g, 'rect', { x:(amplicons[x].startPos - <xsl:value-of select="bases/base[1]/@pos"/>), y:y, width:(amplicons[x].endPos - amplicons[x].startPos), height:'25', opacity:'0.5', style:'fill: ' + color + ';' });
a(g, 'rect', { x:(amplicons[x].startPos - <xsl:value-of select="bases/base[1]/@pos"/>), y:'-' + (svgHeight - 90), width:'1', height:(svgHeight - 90 + y), opacity:'0.5', style:'fill: ' + color + ';' });
a(g, 'rect', { x:(amplicons[x].endPos - <xsl:value-of select="bases/base[1]/@pos"/> - 1), y:'-' + (svgHeight - 90), width:'1', height:(svgHeight - 90 + y), opacity:'0.5', style:'fill: ' + color + ';' });
a(g, 'text', { x:(((amplicons[x].startPos - <xsl:value-of select="bases/base[1]/@pos"/>) * xScale) + 5), y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = amplicons[x].name;
}
else if((amplicons[x].startPos &lt; <xsl:value-of select="bases/base[1]/@pos"/>) &amp;&amp; (amplicons[x].endPos &lt;= <xsl:value-of select="bases/base[last()]/@pos"/>)) {
a(g, 'rect', { x:'0', y:y, width:(amplicons[x].endPos - <xsl:value-of select="bases/base[1]/@pos"/>), height:'25', opacity:'0.5', style:'fill: ' + color + ';' });
a(g, 'rect', { x:(amplicons[x].endPos - <xsl:value-of select="bases/base[1]/@pos"/> - 1), y:'-' + (svgHeight - 90), width:'1', height:(svgHeight - 90 + y), opacity:'0.5', style:'fill: ' + color + ';' });
a(g, 'polygon', { points:'0,' + y + ' 0,' + (y + 25) + ' -25,' + (y + 12), transform:'scale(' + (1 / xScale) + ' 1)', opacity:'0.5', style:'fill: ' + color + ';' });
a(g, 'text', { x:'-75', y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = (<xsl:value-of select="bases/base[1]/@pos"/> - amplicons[x].startPos) + " bp";
a(g, 'text', { x:'5', y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = amplicons[x].name;
}
else if((amplicons[x].startPos >= <xsl:value-of select="bases/base[1]/@pos"/>) &amp;&amp; (amplicons[x].endPos > <xsl:value-of select="bases/base[last()]/@pos"/>)) {
a(g, 'rect', { x:(amplicons[x].startPos - <xsl:value-of select="bases/base[1]/@pos"/>), y:y, width:(<xsl:value-of select="bases/base[last()]/@pos"/> - amplicons[x].startPos), height:'25', opacity:'0.5', style:'fill: ' + color + ';' });
a(g, 'rect', { x:(amplicons[x].startPos - <xsl:value-of select="bases/base[1]/@pos"/>), y:'-' + (svgHeight - 90), width:'1', height:(svgHeight - 90 + y), opacity:'0.5', style:'fill: ' + color + ';' });
a(g, 'polygon', { points:chartBoundingBox.width + ',' + y + ' ' + chartBoundingBox.width + ',' + (y + 25) + ' ' + (chartBoundingBox.width + 25) + ',' + (y + 12), transform:'scale(' + (1 / xScale) + ' 1)', opacity:'0.5', style:'fill: ' + color + ';' });
a(g, 'text', { x:(chartBoundingBox.width + 27), y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = (amplicons[x].endPos - <xsl:value-of select="bases/base[last()]/@pos"/>) + " bp";
a(g, 'text', { x:(((amplicons[x].startPos - <xsl:value-of select="bases/base[1]/@pos"/>) * xScale) + 5), y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = amplicons[x].name;
}
else if((amplicons[x].startPos &lt; <xsl:value-of select="bases/base[1]/@pos"/>) &amp;&amp; (amplicons[x].endPos > <xsl:value-of select="bases/base[last()]/@pos"/>)) {
a(g, 'rect', { x:'0', y:y, width:(<xsl:value-of select="bases/base[last()]/@pos"/> - <xsl:value-of select="bases/base[1]/@pos"/>), height:'25', opacity:'0.5', style:'fill: ' + color + ';' });
a(g, 'polygon', { points:'0,' + y + ' 0,' + (y + 25) + ' -25,' + (y + 12), transform:'scale(' + (1 / xScale) + ' 1)', opacity:'0.5', style:'fill: ' + color + ';' });
a(g, 'text', { x:'-75', y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = (<xsl:value-of select="bases/base[1]/@pos"/> - amplicons[x].startPos) + " bp";
a(g, 'polygon', { points:chartBoundingBox.width + ',' + y + ' ' + chartBoundingBox.width + ',' + (y + 25) + ' ' + (chartBoundingBox.width + 25) + ',' + (y + 12), transform:'scale(' + (1 / xScale) + ' 1)', opacity:'0.5', style:'fill: ' + color + ';' });
a(g, 'text', { x:(chartBoundingBox.width + 27), y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = (amplicons[x].endPos - <xsl:value-of select="bases/base[last()]/@pos"/>) + " bp";
a(g, 'text', { x:'5', y:(y + 15), transform:'scale(' + (1 / xScale) + ' 1)', style:'font-size: small;' }).context.textContent = amplicons[x].name;
}
}

}
*/