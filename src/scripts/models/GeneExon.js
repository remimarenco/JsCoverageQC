'use strict';

var cSortedMap = require("collections/sorted-map");

var ampliconModel = require("Amplicon");
var binModel = require("Bin");

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

	this.nameForCompare = '';
	this.exonNumberForCompare = 0;
	this.suffixForCompare = '';

	this.bins.push(new binModel.Bin(0, 99, "0-99"));
	this.bins.push(new binModel.Bin(100, 499, "100-499"));
	this.bins.push(new binModel.Bin(500, 999, "500-999"));
	this.bins.push(new binModel.Bin(1000, 9999999, "&ge;1000"));
}

GeneExon.prototype = {

};

module.exports = GeneExon;