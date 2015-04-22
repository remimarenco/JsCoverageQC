'use strict';

var cSortedMap = require("collections/sorted-map");

var ampliconModel = require("Amplicon");

function GeneExon(){
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
	this.codingRegion = new ampliconModel.Amplicon(); // regions in the amplicon BED file that have a name with a "_coding" suffix
	this.variants = []; // Original ArrayList<Variant>
	this.doNotCallVariantsAlways = []; // Original ArrayList<Variant>

	
}

GeneExon.prototype = {

};

module.exports = GeneExon;