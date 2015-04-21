'use strict';

var cSortedSet = require("collections/sorted-set");
var cList = require("collections/list");
var cSortedMap = require("collections/sorted-map");

function Vcf(){
	this.fileName = '';
	this.doNotCallFile = '';
	this.exonBedFileName = '';
	this.variantTsvFileName = '';
	this.variantTsvFileLineCount = 0;
	this.runDate = new Date();
	this.geneExons = new cSortedSet(); // TreeSet<GeneExon>
	this.bedBamVcfFileUrls = new cList();
	this.bases = new cSortedMap(); // TreeMap<String, Base>
}

Vcf.prototype = {
	baseCount: function(){
		return this.bases.size();
	},
	getFilteredAnnotatedVariantCount: function(){
		//var getFilteredAnnotatedVariantCount = 0;

	},
};

module.exports = Vcf;