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
	return variant2;
};

Variant.prototype = {

};

module.exports = Variant;