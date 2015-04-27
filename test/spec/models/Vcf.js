'use strict';

var cSortedSet = require("collections/sorted-set");
var cList = require("collections/list");
var cSortedMap = require("collections/sorted-map");

describe('Vcf', function(){
	var Vcf;
	var vcf;

	beforeEach(function(){
		Vcf = require('models/Vcf');

		vcf = new Vcf();
	});

	it('should construct properly with no parameters passed', function(){
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