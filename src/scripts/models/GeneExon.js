'use strict';

var cSortedMap = require("collections/sorted-map");

var Amplicon = require("./Amplicon.js");
var Bin = require("./Bin.js");

function regexpPart(geneExon, bedLineSplit){
	// We get the vendor-gene-exon-name
	var re = /vendor-gene-exon-name: (.*)\|.*\|.*\|.*\|.*/;
	var found = bedLineSplit[5].match(re);
	if(found){
		geneExon.vendorGeneExonName = found[1];
	}

	// We get the Ensembl-IDs.
	// 1°) ensemblGeneId
	// 2°) ensemblTranscriptId
	// 3°) ensemblExonId
	re = /.*\|Ensembl-IDs: ([A-Z0-9\.]*):([A-Z0-9\.]*):([A-Z0-9\.]*)\|.*\|.*\|.*/;
	found = bedLineSplit[5].match(re);
	geneExon.ensemblGeneId = found[1];
	geneExon.ensemblTranscriptId = found[2];
	geneExon.ensemblExonId = found[3];

	re = /.*\|.*\|Ensembl-exon-number: (.*)\|.*\|.*/;
	found = bedLineSplit[5].match(re);
	if(found){
		geneExon.ensemblExonNumber = found[1];
	}

	re = /.*\|.*\|.*\|pct-of-exon: (.*)\|.*/;
	found = bedLineSplit[5].match(re);
	if(found){
		geneExon.pctOfExon = Math.round(parseFloat(found[1]));
	}

	re = /.*\|.*\|.*\|.*\|RefSeq-acc-no: (.*)/;
	found = bedLineSplit[5].match(re);
	if(found){
		geneExon.refSeqAccNo = found[1];
	}

	re = /([A-Za-z0-9]*)ex([0-9]*)(.*)?/;
	found = geneExon.name.match(re);
	if(found){
		geneExon.nameForCompare = found[1] + 'ex';
		geneExon.exonNumberForCompare = parseInt(found[2]);
		geneExon.suffixForCompare = ((found[3] !== null && typeof found[3] !== 'undefined') ? found[3] : '');
	}
}

function GeneExon(bedLine){
	this.chr = '';
	this.startPos = -1;
	this.endPos = -1;
	this.name = '';
	this.qc = ''; // "pass", "warn", "fail"
	this.ensemblGeneId = ''; // parsed from exon BED custom field #5 (capture group 1): /.*\\|Ensembl-IDs: ([A-Z0-9\\.]*):([A-Z0-9\\.]*):([A-Z0-9\\.]*)\\|.*\\|.*/
	this.ensemblExonId = ''; // parsed from exon BED custom field #5 (capture group 3): /.*\\| /.*\\|Ensembl-IDs: ([A-Z0-9\\.]*):([A-Z0-9\\.]*):([A-Z0-9\\.]*)\\|.*\\|.*/
	this.ensemblExonNumber = ''; // parsed from exon BED custom field #5: /.*\\|.*\\|Ensembl-exon-number: (.*)\\|.*/
	this.vendorGeneExonName = ''; // parsed from exon BED custom field #5: /vendor-gene-exon-name: (.*)\\|.*\\|.*\\|.*/
	this.pctOfExon = 0.00; // parsed from exon BED custom field #5: /.*\\|.*\\|.*\\|pct-of-exon: (.*)/
	this.refSeqAccNo = '';
	this.bases = new cSortedMap(); // Original TreeMap<Long, Base>
	this.bins = []; // Original ArrayList<Bin>
	this.amplicons = []; // Original ArrayList<Amplicon>
	this.codingRegion = new Amplicon(); // regions in the amplicon BED file that have a name with a "_coding" suffix
	this.variants = []; // Original ArrayList<Variant>
	this.doNotCallVariantsAlways = []; // Original ArrayList<Variant>

	this.nameForCompare = '';
	this.exonNumberForCompare = 0;
	this.suffixForCompare = '';

	this.bins.push(new Bin(0, 99, "0-99"));
	this.bins.push(new Bin(100, 499, "100-499"));
	this.bins.push(new Bin(500, 999, "500-999"));
	this.bins.push(new Bin(1000, 9999999, "&ge;1000"));

	var fields = bedLine.split("\t");
	this.chr = fields[0];
	/** @type {int} +1 instead of +0 so will contain very last endPos (errors when variant is on the end position  */
	this.startPos = parseInt(fields[1]) + 1;
	this.endPos = parseInt(fields[2]) + 0;
	this.name = fields[3];

	regexpPart(this, fields);
}

GeneExon.prototype = {
	/**
	 * Function to compare two GeneExons
	 * TODO: Check what are *ForCompare variables and where they are used
	 * @param  {[type]} otherGeneExon [description]
	 * @return {[type]}               [description]
	 */
	compareTo: function(otherGeneExon){
		var nameForCompareComparison = this.nameForCompare.localeCompare(otherGeneExon.nameForCompare);
		// Compare Integer
		var exonNumberForCompareComparison;
		if(this.exonNumberForCompare === otherGeneExon.exonNumberForCompare){
			exonNumberForCompareComparison = 0;
		}
		else if(this.exonNumberForCompare < otherGeneExon.exonNumberForCompare){
			exonNumberForCompareComparison = -1;
		}
		else{
			exonNumberForCompareComparison = 1;
		}

		// Compare the different parts of the name
		if(nameForCompareComparison !== 0){
			return nameForCompareComparison;
		}
		else if(exonNumberForCompareComparison !== 0){
			return exonNumberForCompareComparison;
		}
		else if(this.suffixForCompare !== null  && typeof this.suffixForCompare !== 'undefined'){
			return this.suffixForCompare.localeCompare(otherGeneExon.suffixForCompare);
		}
		return 0;
	},
	/**
	 * List of bases, primarily for JAXB XML generation
	 * @return {Array} Array of Base
	 */
	getBasesAsList: function(){
		return this.bases.values();
	},
	/**
	 * True if a variant was called in this exon
	 * @return {boolean} [description]
	 */
	getVariantCalled: function(){
		this.bases.values().forEach(function(base){
			if(base.variant !== null){
				return true;
			}
		});
		if(this.variants.length > 0){
			return true;
		}
		return false;
	},
	/**
	 * True if a variant was annotated in this exon.
	 * @return {boolean} [description]
	 */
	getVariantAnnotated: function(){
		if(this.variants.length > 0){
			return true;
		}
		return false;
	},
	/**
	 * True if variantlist is the same size as donotcalllist, hence it only contains do not calls; also must be annotated to be true
	 * @return {boolean} [description]
	 */
	getOnlyContainsDoNotCallAlways: function(){
		if(this.variants.length === this.doNotCallVariantsAlways.length && this.variants.length > 0){
			return true;
		}
		else{
			return false;
		}
	}
};

module.exports = GeneExon;