'use strict';

var cSortedSet = require("collections/sorted-set");
var cList = require("collections/list");
var cSortedMap = require("collections/sorted-map");

/**
 * [Vcf description]
 */
function Vcf(){
	this.fileName = '';
	this.doNotCallFile = '';
	this.exonBedFileName = '';
	this.variantTsvFileName = '';
	this.variantTsvFileLineCount = 0;
	this.runDate = new Date();
	this.geneExons = new cSortedSet(); // TreeSet<GeneExon>
	/** @type {cList} These are used to construct an IGV link */
	this.bedBamVcfFileUrls = new cList();
	/** @type {cSortedMap} key is chr|pos (e.g., "chr9|320001") */
	this.bases = new cSortedMap(); // TreeMap<String, Base>
}

Vcf.prototype = {
	/**
	 * [getBaseCount description]
	 * @return {Integer} The number of bases
	 */
	getBaseCount: function(){
		return this.bases.length;
	},
	/**
	 * [getFilteredAnnotatedVariantCount description]
	 * @return {Integer} [description]
	 */
	getFilteredAnnotatedVariantCount: function(){
		var filteredAnnotatedVariantCount = 0;
		this.geneExons.forEach(function(geneExon){
			filteredAnnotatedVariantCount += geneExon.variants.length;
		});
		return filteredAnnotatedVariantCount;
	},
	getAmpliconCount: function(){
		var amplicons = new cSortedSet();
		this.geneExons.forEach(function(geneExon){
			geneExon.amplicons.forEach(function(amplicon){
				amplicons.add(amplicon);
			});
		});
		return amplicons.length;
	},
	getReadDepthCount: function(){
		var readDepthCount = 0;
		this.bases.values().forEach(function(base){
			readDepthCount += base.readDepths.length;
		});
	},
	/**
	 * [findGeneExonsForChrPos description]
	 * @param  {string} chr [description]
	 * @param  {int} pos [description]
	 * @return {cSortedSet}     The set of exons that contain the coordinate
	 */
	findGeneExonsForChrPos: function(chr, pos){
		return this.findGeneExonsForChrRange(chr, pos, pos);
	},
	/**
	 * [findGeneExonsForChrRange description]
	 * @param  {string} chr      [description]
	 * @param  {int} startPos [description]
	 * @param  {int} endPos   [description]
	 * @return {cSortedSet}          The set of exons that contain any part of the region
	 */
	findGeneExonsForChrRange: function(chr, startPos, endPos){
		var matchedGeneExons = new cSortedSet();
		// TODO: Check how the equals function is supported in Javascript and
		// with the compareTo implemented
		this.geneExons.forEach(function(geneExon){
			if(geneExon.chr.equals(chr) &&
				(geneExon.startPos <= endPos && geneExon.endPos >= startPos)){
				matchedGeneExons.add(geneExon);
			}
		});
		return matchedGeneExons;
	},
	getBedBamVcfFileUrlAsString: function(){
		//TODO: Check how this function should work as we are now in Browser / Upload File system
		// This function also seems never used in the Java Program
	}
};

module.exports = Vcf;