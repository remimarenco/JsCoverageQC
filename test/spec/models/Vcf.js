'use strict';

var cSortedSet = require("collections/sorted-set");
var cList = require("collections/list");
var cSortedMap = require("collections/sorted-map");

var GeneExon = require("models/GeneExon.js");
var Amplicon = require("models/Amplicon.js");
var Base = require("models/Base.js");
var Variant = require("models/Variant.js");

function getResponseText(fromUrl){
	var req = new XMLHttpRequest();
	req.open("GET", fromUrl, false);
	req.responseType = "text";
	req.send();
	return req.responseText;
}

describe('Vcf', function(){
	var Vcf;
	var vcfFileName;
	var vcfText;

	var exonBedFileName;
	var exonBedText;

	var ampliconBedFileName;
	var ampliconBedText;

	var variantFileName;
	var variantText;
	var variantFileLineCount;

	beforeAll(function(){
		Vcf = require('models/Vcf');

		var dataAccessUrl = "http://localhost:8080/base/test/data/";

		vcfFileName = "sample.genome.vcf";
		vcfText = getResponseText(dataAccessUrl + vcfFileName);
		exonBedFileName = "cancer_panel_26.20140719.exons.bed";
		exonBedText = getResponseText(dataAccessUrl + exonBedFileName);
		ampliconBedFileName = "cancer_panel_26.20140717.amplicons.bed";
		ampliconBedText = getResponseText(dataAccessUrl + ampliconBedFileName);
		variantFileName = "sample.variant.tsv";
		variantText = getResponseText(dataAccessUrl + variantFileName);
		variantFileLineCount = variantText.split("\n").length;
	});

	beforeEach(function(){
		
	});

	it('should construct properly with no parameters passed', function(){
		var vcf = new Vcf();

		expect(vcf.fileName).toBeUndefined();
		expect(vcf.doNotCallFileName).toEqual("NO DO NOT CALL FILE USED!");
		expect(vcf.exonBedFileName).toBeUndefined();
		expect(vcf.ampliconBedFileName).toBeUndefined();
		expect(vcf.variantTsvFileName).toBeUndefined();
		expect(vcf.variantTsvFileLineCount).toBeUndefined();
		expect(vcf.runDate).toEqual(jasmine.any(Date));
		expect(vcf.geneExons).toEqual(jasmine.any(cSortedSet));
		expect(vcf.bedBamVcfFileNames).toEqual(jasmine.any(cList));
		expect(vcf.bases).toEqual(jasmine.any(cSortedMap));
	});

	it('should construct properly with good parameters passed (no doNotCall)', function(){
		var vcf = new Vcf(vcfFileName, vcfText, exonBedFileName, exonBedText, ampliconBedFileName,
	ampliconBedText, variantFileName, variantFileLineCount);

		expect(vcf.fileName).toEqual(vcfFileName);
		expect(vcf.vcfLines).toEqual(vcfText);
		expect(vcf.doNotCallFileName).toEqual("NO DO NOT CALL FILE USED!");
		expect(vcf.exonBedFileName).toEqual(exonBedFileName);
		expect(vcf.ampliconBedFileName).toEqual(ampliconBedFileName);
		expect(vcf.ampliconBedLines).toEqual(ampliconBedText);
		expect(vcf.variantTsvFileName).toEqual(variantFileName);
		expect(vcf.variantTsvFileLineCount).toEqual(variantFileLineCount);
		expect(vcf.runDate).toEqual(jasmine.any(Date));
		expect(vcf.geneExons.length).toEqual(85);
		expect(vcf.bedBamVcfFileNames.length).toEqual(1);
		expect(vcf.bedBamVcfFileNames.has(ampliconBedFileName)).toBeTruthy();
		expect(vcf.bases.length).toEqual(14882);
	});

	describe('and its function', function(){
		var vcf;

		beforeAll(function(){
				vcf = new Vcf(vcfFileName, vcfText, exonBedFileName, exonBedText, ampliconBedFileName,
			ampliconBedText, variantFileName, variantFileLineCount);
		});

		describe('getBaseCount', function(){
			it('should be defined', function(){
				expect(vcf.getBaseCount).toBeDefined();
			});

			it('should return the number of bases in Vcf object', function(){
				// Process the number of bases
				var nbBases = vcf.bases.length;

				// Expect the same with getBaseCount
				expect(vcf.getBaseCount()).toEqual(nbBases);
			});
		});

		describe('getFilteredAnnotatedVariantCount', function(){
			it('should be defined', function(){
				expect(vcf.getFilteredAnnotatedVariantCount).toBeDefined();
			});

			it('should return the number of filtered annotated variant in Vcf object', function(){
				var filteredAnnotatedVariantCount = 0;
				vcf.geneExons.forEach(function(geneExon){
					filteredAnnotatedVariantCount += geneExon.variants.length;
				});

				expect(vcf.getFilteredAnnotatedVariantCount()).toEqual(filteredAnnotatedVariantCount);
			});
		});

		describe('getAmpliconCount', function(){
			it('should be defined', function(){
				expect(vcf.getAmpliconCount).toBeDefined();
			});

			it('should return the number of amplicons in each geneExon in Vcf object', function(){
				var amplicons = new cSortedSet();
				vcf.geneExons.forEach(function(geneExon){
					geneExon.amplicons.forEach(function(amplicon){
						amplicons.push(amplicon);
					});
				});

				expect(vcf.getAmpliconCount()).toEqual(amplicons.length);
			});
		});

		describe('getReadDepthCount', function(){
			it('should be defined', function(){
				expect(vcf.getReadDepthCount).toBeDefined();
			});

			it('should return total read depth count in Vcf object', function(){
				var readDepthCount = 0;
				vcf.bases.values().forEach(function(base){
					readDepthCount += base.readDepths.length;
				});

				expect(vcf.getReadDepthCount()).toEqual(readDepthCount);
			});
		});

		describe('findGeneExonsForChrPos', function(){
			it('should be defined', function(){
				expect(vcf.findGeneExonsForChrPos).toBeDefined();
			});

			it('should return 0 when no  in Vcf object', function(){
				expect(vcf.findGeneExonsForChrPos()).toEqual(jasmine.any(cSortedSet));
				expect(vcf.findGeneExonsForChrPos().length).toEqual(0);
			});

			// TODO: Search a matchedGeneExon here and test it when using findGeneExons...
		});

		describe('findGeneExonsForChrRange', function(){
			it('should be defined', function(){
				expect(vcf.findGeneExonsForChrRange).toBeDefined();
			});

			it('should return a SortedSet with a 1 length when 85 geneExons in Vcf object, and good parameters', function(){
				expect(vcf.findGeneExonsForChrRange('chr14', 105246419 + 1, 105246558 + 0)).toEqual(jasmine.any(cSortedSet));
				expect(vcf.findGeneExonsForChrRange('chr14', 105246426, 105246553).length).toEqual(1);
			});

			it('should return a SortedSet with a 0 length when 85 geneExons in Vcf object, and bad parameters', function(){
				expect(vcf.findGeneExonsForChrRange('chr40', 105246400 + 1, 105246800 + 0)).toEqual(jasmine.any(cSortedSet));
				expect(vcf.findGeneExonsForChrRange('chr40', 105246400 + 1, 105246800 + 0).length).toEqual(0);
			});
		});
	});
});