'use strict';

var cSortedSet = require("collections/sorted-set");
var cList = require("collections/list");
var cSortedMap = require("collections/sorted-map");

function getResponseText(fromUrl){
	var req = new XMLHttpRequest();
	req.open("GET", fromUrl, false);
	req.responseType = "text";
	req.send();
	return req.responseText;
}

describe('Vcf', function(){
	var Vcf;
	var vcfFileUrl;
	var vcfText;

	var exonBedFileUrl;
	var exonBedText;

	var ampliconBedFileName;
	var ampliconBedText;

	var variantFileUrl;
	var variantText;
	var variantFileLineCount;

	beforeEach(function(){
		Vcf = require('models/Vcf');

		vcfFileUrl = "http://localhost:8080/base/test/data/sample.genome.vcf";
		vcfText = getResponseText(vcfFileUrl);
		exonBedFileUrl = "http://localhost:8080/base/test/data/cancer_panel_26.20140719.exons.bed";
		exonBedText = getResponseText(exonBedFileUrl);
		ampliconBedFileName = "cancer_panel_26.20140717.amplicons.bed";
		ampliconBedText = getResponseText("http://localhost:8080/base/test/data/"+ampliconBedFileName);
		variantFileUrl = "http://localhost:8080/base/test/data/sample.variant.tsv";
		variantText = getResponseText(variantFileUrl);
		variantFileLineCount = variantText.split("\n").length;
	});

	it('should construct properly with no parameters passed', function(){
		var vcf = new Vcf();

		expect(vcf.fileUrl).toBeUndefined();
		expect(vcf.doNotCallFileUrl).toEqual("NO DO NOT CALL FILE USED!");
		expect(vcf.exonBedFileUrl).toBeUndefined();
		expect(vcf.ampliconBedFileName).toBeUndefined();
		expect(vcf.variantTsvFileUrl).toBeUndefined();
		expect(vcf.variantTsvFileLineCount).toBeUndefined();
		expect(vcf.runDate).toEqual(jasmine.any(Date));
		expect(vcf.geneExons).toEqual(jasmine.any(cSortedSet));
		expect(vcf.bedBamVcfFileUrls).toEqual(jasmine.any(cList));
		expect(vcf.bases).toEqual(jasmine.any(cSortedMap));
	});

	it('should construct properly with good parameters passed (no doNotCall)', function(){
		// TODO: Create a test file uploading function in utilities.js to manage properly the async used by Jasmine
		// fileUrl => sample.genome.vcf
		// doNotCallFile => Not yet
		// exonBedFileUrl => cancer_panel_26.20140719.exons.bed
		// ampliconBedFileName => cancer_panel_26.20140717.amplicons.bed
		// variantTsvFileUrl => sample.variant.tsv
		// variantTsvFileLineCount => Process it (9)
		// vcf.geneExons.length => 85
		var vcf = new Vcf(vcfFileUrl, exonBedFileUrl, exonBedText, ampliconBedFileName,
	variantFileUrl, variantFileLineCount);

		expect(vcf.fileUrl).toBeUndefined();
		expect(vcf.doNotCallFileUrl).toEqual("NO DO NOT CALL FILE USED!");
		expect(vcf.exonBedFileUrl).toBeUndefined();
		expect(vcf.variantTsvFileUrl).toBeUndefined();
		expect(vcf.variantTsvFileLineCount).toBeUndefined();
		expect(vcf.runDate).toEqual(jasmine.any(Date));
		expect(vcf.geneExons).toEqual(jasmine.any(cSortedSet));
		expect(vcf.bedBamVcfFileUrls).toEqual(jasmine.any(cList));
		expect(vcf.bases).toEqual(jasmine.any(cSortedMap));

		//TODO: Missing the test of the values
	});

	describe('and its function', function(){
		describe('getBaseCount', function(){

		});
	});
});