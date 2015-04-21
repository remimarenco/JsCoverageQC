'use strict';

function Vcf(){
	this.fileName = '';
	this.doNotCallFile = '';
	this.exonBedFileName = '';
	this.variantTsvFileName = '';
	this.variantTsvFileLineCount = 0;
	this.runDate = new Date();
	this.geneExons = ''; // TreeSet<GeneExon>
	this.bedBamVcfFileUrls = [];
	this.bases = ''; // TreeMap<String, Base>
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