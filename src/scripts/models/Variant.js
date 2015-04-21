'use strict';

/**
 * [Variant description]
 * @param {string} tsvHeadingLine [description]
 * @param {string} tsvDataLine    [description]
 * @param {Array} doNotCalls     [description]
 */
function Variant(tsvHeadingLine, tsvDataLine, doNotCalls){
	this.gene = '';
	this.variant = '';
	this.chr = -1;
	this.coordinate = -1;
	this.type = '';
	this.genotype = '';
	this.altVariantFreq = 0.00;
	this.readDepth = 0;
	this.altReadDepth = 0;
	this.consequence = '';
	this.cosmicId = '';
	this.hgvsc = '';
	this.hgvsp = '';
	this.dbSnpIdPrefix = '';
	this.dbSnpIdSuffix = '';
	this.filters = '';
	this.alleleFreqGlobalMinor = 0.00;
	this.geneMutation = '';
	this.hgvscComplete = '';
	this.hgvspComplete = '';
	this.ensp = '';
	this.onTheDoNotCallList = false;
	this.typeOfDoNotCall = '';
	this.transcript = '';
}

/**
 * [checkIfOnDoNOTCallList description]
 * @param  {Variant} variant2   [description]
 * @param  {Array} doNotCalls [description]
 * @return {Variant}            [description]
 */
Variant.checkIfOnDoNOTCallList = function(variant2, doNotCalls){
	variant2.onTheDoNotCallList = false;
	variant2.typeOfDoNotCall = "Not on lab list /Potentially Valid";
	//TODO: Fix the "Definatively" error
	var currentltyCanDefinativelyCompare;

	for(var i=0; i < doNotCalls.length; i++){
		var currentDoNotCall = doNotCalls[i];
		var doNotCallComparison = null;
		var variantComparison = null;
		var doNotCallComparison_transcript = currentDoNotCall.transcript;
		var variantComparison_transcript = variant2.transcript;
		var doNotCallComparison_coordinate = currentDoNotCall.coordinate;
		var variantComparison_coordinate = variant2.coordinate;

		//Currently only checking Transcript_27 and if empty in tsv or do not call will crash
		if(currentDoNotCall.hgvsc !== null && variant2.hgvscComplete !== null){
			currentltyCanDefinativelyCompare = true;
			doNotCallComparison = currentDoNotCall.hgvsc;
			variantComparison = variant2.hgvscComplete;
		}
		else{
			currentltyCanDefinativelyCompare = false;
		}

		if(doNotCallComparison_transcript.equals(variantComparison_transcript) &&
			variantComparison_coordinate.equals(doNotCallComparison_coordinate))
		{
			variant2.onTheDoNotCallList = true;
			//adding a fourth call type, meaning if it is the exact location of a do not call
			//but does not match by hgvsccomple then a separate warning
			if(currentltyCanDefinativelyCompare)
			{
				if(doNotCallComparison.equals(variantComparison)){
					variant2.typeOfDoNotCall = currentDoNotCall.calltType;
					break;
				}
				else{
					variant2.typeOfDoNotCall = "In same location as do not call variant.  However mutation is different";
					//still look because maybe better matching variant is available, hence don't break loop
				}
			}
			else{
				variant2.typeOfDoNotCall="In same location as do not call variant. However can't compare if same mutation.";
				//still look because maybe better matching variant is available, hence don't break loop
			}
		}
	}

	return variant2;
};

Variant.prototype = {

};

module.exports = Variant;