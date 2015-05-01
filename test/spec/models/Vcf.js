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
	var vcfFileName;
	var vcfText;

	var exonBedFileName;
	var exonBedText;

	var ampliconBedFileName;
	var ampliconBedText;

	var variantFileName;
	var variantText;
	var variantFileLineCount;

	beforeEach(function(){
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
		// TODO: Create a test file uploading function in utilities.js to manage properly the async used by Jasmine
		// fileUrl => sample.genome.vcf
		// doNotCallFile => Not yet
		// exonBedFileUrl => cancer_panel_26.20140719.exons.bed
		// ampliconBedFileName => cancer_panel_26.20140717.amplicons.bed
		// variantTsvFileUrl => sample.variant.tsv
		// variantTsvFileLineCount => Process it (9)
		// vcf.geneExons.length => 85
		// vcf.bases.length => 14882
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
		beforeEach(function(){
			// vcf = new Vcf(vcfFileUrl, vcfText, exonBedFileUrl, exonBedText, ampliconBedFileName,
				// ampliconBedText, variantFileUrl, variantFileLineCount);
		});

		describe('getBaseCount', function(){
			it('should be defined', function(){
				// expect(vcf.getBaseCount).toBeDefined();
			});

			it('should return 0 when no bases in Vcf object', function(){
				// expect(vcf.getBaseCount()).toEqual(0);
			});
		});

		describe('getFilteredAnnotatedVariantCount', function(){
			it('should be defined', function(){
				//expect(vcf.getFilteredAnnotatedVariantCount).toBeDefined();
			});

			it('should return 0 when no geneExons in Vcf object', function(){
				//expect(vcf.getFilteredAnnotatedVariantCount()).toEqual(0);
			});

			/* TODO: Add GeneExons
			it('should not return 0 when geneExons in Vcf object', function(){
				expect(vcf.getFilteredAnnotatedVariantCount()).not.toEqual(0);
			});
			*/
		});

		describe('getAmpliconCount', function(){
			it('should be defined', function(){
				//expect(vcf.getAmpliconCount).toBeDefined();
			});

			it('should return 0 when no geneExons in Vcf object', function(){
				//expect(vcf.getFilteredAnnotatedVariantCount()).toEqual(0);
			});

			// TODO: Add GeneExons
			it('should not return 0 when geneExons in Vcf object', function(){
				// expect(vcf.getAmpliconCount()).not.toEqual(0);
			});
		});

		describe('getReadDepthCount', function(){
			it('should be defined', function(){
				//expect(vcf.getReadDepthCount).toBeDefined();
			});

			it('should return 0 when no bases in Vcf object', function(){
				//expect(vcf.getReadDepthCount()).toEqual(0);
			});

			// TODO: Add GeneExons
			it('should not return 0 when bases in Vcf object', function(){
				//expect(vcf.getReadDepthCount()).not.toEqual(0);
			});
		});

		describe('findGeneExonsForChrPos', function(){
			it('should be defined', function(){
				//expect(vcf.findGeneExonsForChrPos).toBeDefined();
			});

			it('should return a SortedSet with a 0 length when 85 geneExons in Vcf object but no parameters', function(){
				//expect(vcf.findGeneExonsForChrPos()).toEqual(jasmine.any(cSortedSet));
				//expect(vcf.findGeneExonsForChrPos().length).toEqual(0);
			});

			// TODO: Add GeneExons
			it('should return a SortedSet with not a 0 length when no geneExons in Vcf object', function(){
				// expect(vcf.findGeneExonsForChrPos().length).not.toEqual(0);
			});
		});

		describe('findGeneExonsForChrRange', function(){
			it('should be defined', function(){
				//expect(vcf.findGeneExonsForChrRange).toBeDefined();
			});

			it('should return a SortedSet with a 0 length when 85 geneExons in Vcf object, and no parameters', function(){
				//expect(vcf.findGeneExonsForChrRange()).toEqual(jasmine.any(cSortedSet));
				//expect(vcf.findGeneExonsForChrRange().length).toEqual(0);
			});

			it('should return a SortedSet with a 1 length when 85 geneExons in Vcf object, and good parameters', function(){
				//expect(vcf.findGeneExonsForChrRange('chr14', 105246419 + 1, 105246558 + 0)).toEqual(jasmine.any(cSortedSet));
				// expect(vcf.findGeneExonsForChrRange('chr14', 105246426, 105246553).length).toEqual(1);
			});

			it('should return a SortedSet with a 0 length when 85 geneExons in Vcf object, and bad parameters', function(){
				//expect(vcf.findGeneExonsForChrRange('chr40', 105246400 + 1, 105246800 + 0)).toEqual(jasmine.any(cSortedSet));
				//expect(vcf.findGeneExonsForChrRange('chr40', 105246400 + 1, 105246800 + 0).length).toEqual(0);
			});

			// TODO: Add GeneExons
			it('should return a SortedSet with not a 0 length when no geneExons in Vcf object', function(){
				//expect(vcf.findGeneExonsForChrPos('chr14', 105246419 + 1, 105246558 + 0).length).not.toEqual(0);
			});
		});

		describe('getBedBamVcfFileUrlAsString', function(){
			it('should be defined', function(){
				//expect(vcf.getBedBamVcfFileUrlAsString).toBeDefined();
			});

			it('should', function(){
				//expect(vcf.getFilteredAnnotatedVariantCount()).toEqual(0);
			});
		});
	});
});