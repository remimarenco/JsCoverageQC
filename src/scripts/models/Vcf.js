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
};

module.exports = Vcf;