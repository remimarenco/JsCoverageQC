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

	it('should construct properly with good parameters', function(){
		expect(vcf.fileName).toEqual(jasmine.any(String));
		expect(vcf.doNotCallFile).toEqual(jasmine.any(String));
		expect(vcf.exonBedFileName).toEqual(jasmine.any(String));
		expect(vcf.variantTsvFileName).toEqual(jasmine.any(String));
		expect(vcf.variantTsvFileLineCount).toEqual(jasmine.any(Number));
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