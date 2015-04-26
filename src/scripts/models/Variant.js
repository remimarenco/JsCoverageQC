'use strict';

var cDict = require("collections/dict");

function populateHeadings(headings, headingsArray){
	headingsArray.forEach(function(heading, counter){
		var headingName = heading.substring(0, heading.indexOf("_"));
		headings.add(counter, headingName);
	});
}

function parsingOutRefSeqIDs(dataArrayResult, valueToFill){
	var temp = dataArrayResult;
	if(temp !== null){
		var re = /.*:(.*)/;
		var found = temp.match(re);
		if(found){
			valueToFill = found[1];
		}
		else{
			valueToFill = temp;
		}
	}
}

/**
 * Get the dataArray value of the headings value of the headings headingName's key
 * @param  {Array} dataArray                tsv \t split
 * @param  {cDict} headings                 [description]
 * @param  {string} headingName              [description]
 * @param  {any} optionalDefaultParameter Default parameter that could be used the headingNames's key is not found
 * @return {string}                          dataArray value of the headings value of the headings headingName's key
 */
function getDataArrayFromHeadings(dataArray, headings, headingName, optionalDefaultParameter){
	if(typeof optionalDefaultParameter === 'undefined'){
		return dataArray[headings.get(headingName)];
	}
	else{
		return dataArray[headings.get(headingName, optionalDefaultParameter)];
	}
}

/**
 * [checkIfOnDoNOTCallList description]
 * @param  {Variant} variant2   [description]
 * @param  {Array} doNotCalls [description]
 * @return {Variant}            [description]
 */
function checkIfOnDoNOTCallList(variant2, doNotCalls){
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
}

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

	var headingsArray = tsvHeadingLine.split("\t");
	var headings = new cDict();
	populateHeadings(headings, headingsArray);

	var dataArray = tsvDataLine.split("\t");

	// TODO: Manage the parseInt on null return from getDataArrayFromHeadings => NaN
	this.gene = parseInt(getDataArrayFromHeadings(dataArray, headings, "Gene"));
	this.variant = parseInt(getDataArrayFromHeadings(dataArray, headings, "Variant"));
	this.chr = parseInt(getDataArrayFromHeadings(dataArray, headings, "Variant", null));
	// Original note : subtracting zero (0)
	this.coordinate = parseInt(getDataArrayFromHeadings(dataArray, headings, "Coordinate", null)) - 0;
	this.type = parseInt(getDataArrayFromHeadings(dataArray, headings, "Type"));
	this.genotype = parseInt(getDataArrayFromHeadings(dataArray, headings, "Genotype", null));
	this.altVariantFreq = parseFloat(getDataArrayFromHeadings(dataArray, headings, "Alt Variant Freq", null));
	this.readDepth = parseInt(getDataArrayFromHeadings(dataArray, headings, "Read Depth", null));
	this.altReadDepth = parseInt(getDataArrayFromHeadings(dataArray, headings, "Alt Read Depth", null));
	this.consequence = parseInt(getDataArrayFromHeadings(dataArray, headings, "Consequence"));
	this.cosmicId = parseInt(getDataArrayFromHeadings(dataArray, headings, "COSMIC ID"));
	this.filters = parseInt(getDataArrayFromHeadings(dataArray, headings, "Filters"));
	// Original note: this gets Transcript_27 instead of Transcript HGNC_25 because
	// the way substring works it gets string to left of first underscore and
	// in Transcript HGNC_25 case this is Transcript HGNC
	this.transcript = parseInt(getDataArrayFromHeadings(dataArray, headings, "Transcript"));

	var temp_hgvsc = parseInt(getDataArrayFromHeadings(dataArray, headings, "HGVSc"));
	if(temp_hgvsc !== null){
		this.hgvscComplete = temp_hgvsc;
	}

	var temp_hgvsp = parseInt(getDataArrayFromHeadings(dataArray, headings, "HGVSp"));
	if(temp_hgvsp !== null){
		this.hgvspComplete = temp_hgvsp;
	}

	var temp_ensp = parseInt(getDataArrayFromHeadings(dataArray, headings, "ENSP"));
	if(temp_ensp !== null){
		this.ensp = temp_ensp;
	}

	if(doNotCalls !== null || typeof doNotCalls !== 'undefined'){
		// TODO: Check if this is properly modified
		checkIfOnDoNOTCallList(this, doNotCalls);
	}
	else{
		this.onTheDoNotCallList = false;
		this.typeOfDoNotCall = "Not on lab list/Potentially Valid";
	}

	// Original note: parsing out RefSeq IDs
	parsingOutRefSeqIDs(getDataArrayFromHeadings(dataArray, headings, "HGVSc"), this.hgvsc);
	parsingOutRefSeqIDs(getDataArrayFromHeadings(dataArray, headings, "HGVSp"), this.hgvsp);

	var temp_dbSNP_ID = getDataArrayFromHeadings(dataArray, headings, "dbSNP ID");
	if(temp_dbSNP_ID !== null){
		var re = /([A-Za-z]*)([0-9]*)/;
		var found = temp_dbSNP_ID.match(re);
		if(found){
			this.dbSnpIdPrefix = found[1];
			this.dbSnpIdSuffix = found[2];
		}
		else{
			this.dbSnpIdPrefix = temp_dbSNP_ID;
		}
	}

	this.alleleFreqGlobalMinor = parseFloat(getDataArrayFromHeadings(dataArray, headings, "Allele Freq Global Minor", null));
	this.geneMutation = this.gene;
	this.geneMutation += " ";
	this.geneMutation += this.hgvsc;
}



Variant.prototype = {

};

module.exports = Variant;