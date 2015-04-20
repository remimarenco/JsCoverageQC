'use strict';

function Bin(startCount, endCount, name){
	this.startCount = 0;
	this.endCount = 0;
	this.name = "";
	this.count = 0; // Count of reads in this bin
	this.pct = 0; // Percentage of reads in this bin

	this.startCount = startCount;
	this.endCount = endCount;
	this.name = name;
}

Bin.prototype = {
	addCount: function(){
		this.count++;
	},
	processPct: function(geneExonEndPos, geneExonCodingRegionEndPos,
		geneExonStartPos, geneExonCodingRegionStartPos){
		var multiplyBy100_And_ChangeToFloat = (100 * this.count).toFixed(2);
		var getTheMinimum_GeneExonEndPos = Math.min(geneExonEndPos, geneExonCodingRegionEndPos);
		var getTheMaximum_GenexExonStartPos = Math.max(geneExonStartPos, geneExonCodingRegionEndPos);

		var getTheDifferenceBetween_EndResult_And_StartResult = getTheMinimum_GeneExonEndPos - getTheMaximum_GenexExonStartPos + 1;

		var getTheDivisionBetween_Multiply_And_Difference = multiplyBy100_And_ChangeToFloat / getTheDifferenceBetween_EndResult_And_StartResult;

		var roundAllTheProcess = Math.round(getTheDivisionBetween_Multiply_And_Difference);

		this.pct = roundAllTheProcess;
	}
};

module.exports = Bin;