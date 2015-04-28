'use strict';

var cSortedSet = require("collections/sorted-set");
var cList = require("collections/list");
var cSortedMap = require("collections/sorted-map");

var GeneExon = require("./GeneExon.js");
var Amplicon = require("./Amplicon.js");
var Base = require("./Base.js");

/**
 * VCF stands for Variant Call Format, and this file format is used by the 1000 Genomes project to encode SNPs and other structural genetic variants.  The format is further described on the 1000 Genomes project Web site.  VCF calls are available at EBI / NCBI.
 * @param {String} vcfFileUrl              Url of the vcf file
 * @param {String} exonBedFileUrl          Url of the exon bed file
 * @param {Array} exonBedLines            The lines of the exon bed file, in an array
 * @param {String} ampliconBedFileUrl      Url of the amplicon bed file
 * @param {String} variantTsvFileUrl       Url of the variant tsv file
 * @param {Number} variantTsvFileLineCount Line count of the variant tsv file
 * @param {String} bedBamFilesURL          Urls of the bed bam files
 * @param {String} doNotCallFileUrl        Url of the doNotCallFile
 */
function Vcf(vcfFileUrl, vcfNotCutLines, exonBedFileUrl, exonBedNotCutLines, ampliconBedFileUrl,
	ampliconBedNotCutLines, variantTsvFileUrl, variantTsvFileLineCount, bedBamFilesURL,
	doNotCallFileUrl){
	this.fileUrl = ''; // Was fileName in original Java program
	this.vcfLines = '';
	this.exonBedFileUrl = ''; // Was exonBedFileName in original Java program
	this.exonBedLines = '';
	this.ampliconBedFileUrl = '';
	this.ampliconBedLines = '';
	this.variantTsvFileUrl = ''; // Was variantTsvFileName in original Java program
	this.variantTsvFileLineCount = 0;
	this.runDate = new Date();
	this.geneExons = new cSortedSet(); // TreeSet<GeneExon>
	/** @type {cList} These are used to construct an IGV link */
	this.bedBamVcfFileUrls = new cList();
	/** @type {cSortedMap} key is chr|pos (e.g., "chr9|320001") */
	this.bases = new cSortedMap(); // TreeMap<String, Base>

	this.fileUrl = vcfFileUrl;
	this.exonBedFileUrl = exonBedFileUrl;

	// Was doNotCallFile in original Java program
	if(this.doNotCallFileUrl !== null && typeof this.doNotCallFileUrl !== 'undefined'){
		this.doNotCallFileUrl = doNotCallFileUrl;
	}
	else{
		// TODO: Change this way of checking if a doNotCall is used or not in VCF (this.doNotCallFileUsed => Boolean?)
		this.doNotCallFileUrl = "NO DO NOT CALL FILE USED!";
	}
	this.vcfLines = vcfNotCutLines;
	this.exonBedLines = exonBedNotCutLines;
	this.ampliconBedFileUrl = ampliconBedFileUrl;
	this.ampliconBedLines = ampliconBedNotCutLines;
	this.variantTsvFileUrl = variantTsvFileUrl;
	this.variantTsvFileLineCount = variantTsvFileLineCount;

	var self = this;

	/////////////////////////////
	// BedBamFiles Population //
	/////////////////////////////
	if(bedBamFilesURL !== null && typeof bedBamFilesURL !== 'undefined'){
		this.bedBamFilesURL.forEach(function(bedBamFileURL){
			self.bedBamVcfFileUrls.push(bedBamFileURL);
		});
	}

	this.bedBamVcfFileUrls.push(ampliconBedFileUrl);

	//////////////////////////
	// GeneExon Population //
	//////////////////////////
	if(this.exonBedLines !== null && typeof this.exonBedLines !== 'undefined'){
		var arrayExonBedLines = this.exonBedLines.split("\n");
		arrayExonBedLines.forEach(function(exonBedLine){
			if(exonBedLine.search("chr") === 0)
			{
				var newGeneExon = new GeneExon(exonBedLine);
				self.geneExons.push(newGeneExon);
			}
		});
	}

	//////////////////////////
	// Amplicon population //
	//////////////////////////
	if(this.ampliconBedLines !== null && typeof this.ampliconBedLines !== 'undefined'){
		var arrayAmpliconBedLines = this.ampliconBedLines.split("\n");
		arrayAmpliconBedLines.forEach(function(ampliconBedLine){
			// We are only interested in "chr" beginning lines
			if(ampliconBedLine.search("chr") === 0)
			{
				var amplicon = new Amplicon(ampliconBedLine);
				var foundGeneExon = false;

				// If the amplicon is on the gene exon
				// We add it into the geneExon object
				// And add the codingRegion param if amplicon name is finishing with "_coding"
				var geneExonsForChrRange = self.findGeneExonsForChrRange(amplicon.chr, amplicon.startPos, amplicon.endPos);
				if(geneExonsForChrRange !== null && typeof geneExonsForChrRange !== 'undefined'){
					geneExonsForChrRange.forEach(function(geneExon){
						foundGeneExon = true;
						geneExon.amplicons.push(amplicon);
						var endCoding = "_coding";

						if(amplicon.name.search(endCoding) + endCoding.length === amplicon.name.length)
						{
							geneExon.codingRegion = amplicon;
						}
					});
				}
				/*
				if (!foundGeneExon) {
				    console.log("the following amplicon does not correspond to an exon region: " + ampliconBedLine);
				}
				*/
			}
		});
	}


	//////////////////////
	// Base population //
	//////////////////////
	if(this.vcfLines !== null && typeof this.vcfLines !== 'undefined'){
		var arrayVcfLines = this.vcfLines.split("\n");
		arrayVcfLines.forEach(function(vcfLine){
			if (vcfLine.search("#") !== 0) {
				var base = new Base(vcfLine, self.bases);
				var foundGeneExon = false;

				self.findGeneExonsForChrPos(base.chr, base.pos).forEach(function(geneExon){
					foundGeneExon = true;
					geneExon.bases.set(base.pos, base);
				});

				if (!foundGeneExon) {
				    //console.log("the following base does not correspond to an exon region: " + vcfLine);
				}
			}
		});
	}

	this.geneExons.forEach(function(geneExon){
		// If a position is absent, create it with read depth 0
		for(var pos = geneExon.startPos; pos <= geneExon.endPos; pos++){
			var base = new Base(null, self.bases);
			base.pos = pos;
			base.readDepths.add(0);
			self.bases.set(geneExon.chr + "|" + pos, base);
			if(geneExon.bases.has(pos)){
				geneExon.bases.set(pos, self.bases.get(geneExon.chr + "|" + pos));
			}
		}
		// Perform binning operation
		geneExon.bases.forEach(function(base){
			// Don't count a base if it is outside of the coding region
			if (!((base.pos < geneExon.codingRegion.startPos) || (base.pos > geneExon.codingRegion.endPos))) {
			    geneExon.bins.forEach(function(bin){
			    	if (base.getTotalReadDepth() >= bin.startCount &&
			    		base.getTotalReadDepth() <= bin.endCount) {
			    	    bin.addCount();
			    	    bin.processPct();
			    	}
			    });
			}
		});

		// Assign QC value
		if (geneExon.bins.get(0).count > 0 || geneExon.bins.get(1).count > 0) {
		    geneExon.qc = "fail";
		} else if (geneExon.bins.get(2).count > 0) {
		    geneExon.qc = "warn";
		} else if (geneExon.bins.get(3).count > 0) {
		    geneExon.qc = "pass";
		}
	});
	// console.log(this.geneExons.length + " regions read from exon BED file");
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
		// TODO: Optimize this function to avoid process the entire geneExons Set / amplicons Array
		var amplicons = new cSortedSet();
		this.geneExons.forEach(function(geneExon){
			geneExon.amplicons.forEach(function(amplicon){
				console.log("ajout de l'amplicon: "+amplicon);
				amplicons.push(amplicon);
			});
		});
		return amplicons.length;
	},
	getReadDepthCount: function(){
		var readDepthCount = 0;
		this.bases.values().forEach(function(base){
			readDepthCount += base.readDepths.length;
		});
		return readDepthCount;
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
			if(geneExon.chr.localeCompare(chr) === 0 &&
				(geneExon.startPos <= endPos && geneExon.endPos >= startPos)){
				matchedGeneExons.push(geneExon);
			}
		});
		return matchedGeneExons;
	},
	getBedBamVcfFileUrlAsString: function(){
		//TODO: Check how this function should work as we are now in Browser / Upload File system
		// This function also seems never used in the Java Program
	},
	addBedBamVcfFileUrls: function(files){
		files.forEach(function(file){
			this.bedBamFilesURL.push(file);
		});
	}
};

module.exports = Vcf;