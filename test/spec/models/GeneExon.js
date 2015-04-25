'use strict';

describe('GeneExon', function(){
	var cSortedMap = require("collections/sorted-map");

	var Amplicon = require("models/Amplicon.js");
	var Bin = require("models/Bin.js");

	var GeneExon = require("models/GeneExon.js");
	var geneExon;

	var exonBedLines;

	beforeEach(function(done){
		var exonBedFile = "http://localhost:8080/base/test/data/cancer_panel_26.20140719.exons.bed";

		var req = new XMLHttpRequest();
		req.open("GET", exonBedFile, true);
		req.responseType = "text";

		req.onreadystatechange = function (oEvent) {
		  if (req.readyState === 4 && (req.status === 200 || req.status === 0)) {
		    var exonBedText = req.responseText; // Note: not oReq.responseText
		    exonBedLines = exonBedText.split('\n');
		    done();
		  }
		};

		req.send(null);
	});

	it('should construct properly with good parameters passed', function(){
		var exonBedLine = exonBedLines[1];
		geneExon = new GeneExon(exonBedLine);
		expect(geneExon.chr).toEqual('chr14');
		expect(geneExon.startPos).toEqual(105246420);
		expect(geneExon.endPos).toEqual(105246558);
		expect(geneExon.name).toEqual('AKT1ex3');
		expect(geneExon.vendorGeneExonName).toEqual('AKT1ex2');
		expect(geneExon.ensemblGeneId).toEqual('ENSG00000142208.11');
		expect(geneExon.ensemblTranscriptId).toEqual('ENST00000555528.1');
		expect(geneExon.ensemblExonId).toEqual('ENSE00003642995.1');
		expect(geneExon.ensemblExonNumber).toEqual('3');
		expect(geneExon.pctOfExon).toEqual(100.00);
		expect(geneExon.refSeqAccNo).toEqual('NM_005163');
		expect(geneExon.nameForCompare).toEqual('AKT1ex');
		expect(geneExon.exonNumberForCompare).toEqual(3);
		expect(geneExon.suffixForCompare).toEqual('');
	});

	describe('and its function', function(){
		describe(('compareTo'), function(){
			it('should be defined', function(){
				expect(geneExon.compareTo).toBeDefined();
			});

			it('should return 0 when two identical objects are tested (same nameForCompare)', function(){
				var exonBedLine = exonBedLines[1];
				geneExon = new GeneExon(exonBedLine);

				var sameExonBedLine = exonBedLines[1];
				var otherButSameGeneExon = new GeneExon(sameExonBedLine);

				expect(geneExon.compareTo(otherButSameGeneExon)).toEqual(0);
			});

			it('should return -1 when two objects with the same name and differnt exonNumber are tested', function(){
				var exonBedLine = exonBedLines[7];
				geneExon = new GeneExon(exonBedLine);

				var sameExonBedLine = exonBedLines[8];
				var otherBut_sameName_and_differentExonNumber_geneExon = new GeneExon(sameExonBedLine);
				expect(geneExon.compareTo(otherBut_sameName_and_differentExonNumber_geneExon)).toEqual(-1);
			});

			it('should return 0 when two objects with the same name and same exonNumber and different suffixForCompare are tested', function(){
				var exonBedLine = exonBedLines[3];
				geneExon = new GeneExon(exonBedLine);

				var sameExonBedLine = exonBedLines[4];
				var otherBut_sameName_sameExonNumber_differentSuffixForCompare_geneExon = new GeneExon(sameExonBedLine);
				expect(geneExon.compareTo(otherBut_sameName_sameExonNumber_differentSuffixForCompare_geneExon)).toEqual(-1);
			});
		});

		describe(('getBasesAsList'), function(){
			beforeEach(function(){
				var randomInteger_0_85 = Math.floor((Math.random() * 85) + 1);
				var exonBedLine = exonBedLines[randomInteger_0_85];
				geneExon = new GeneExon(exonBedLine);
			});

			it('should be defined', function(){
				expect(geneExon.getBasesAsList).toBeDefined();
			});

			it('should return a list when called', function(){
				expect(geneExon.getBasesAsList()).toEqual(jasmine.any(Array));
			});

			//TODO: Pass a bases object with some bases inside
		});

		describe(('getVariantCalled'), function(){
			it('should be defined', function(){
				expect(geneExon.getVariantCalled).toBeDefined();
			});

			it('should return a Boolean', function(){
				expect(geneExon.getVariantCalled()).toEqual(jasmine.any(Boolean));
			});

			it('should return false when called with a newly construct geneExon', function(){
				expect(geneExon.getVariantCalled()).toEqual(false);
			});

			// TODO: Pass a bases object with one base minimum with a variant (0/1 or 1/1)
		});

		describe(('getVariantAnnotated'), function(){
			it('should be defined', function(){
				expect(geneExon.getVariantAnnotated).toBeDefined();
			});

			it('should return false if no variants in the GeneExon object', function(){
				expect(geneExon.getVariantAnnotated()).toEqual(false);
			});

			// TODO: Add some variants and test if the function return true
		});

		describe(('getOnlyContainsDoNotCallAlways'), function(){
			it('should be defined', function(){
				expect(geneExon.getOnlyContainsDoNotCallAlways).toBeDefined();
			});

			it('should return false if no variants and doNotCall in the GeneExon object', function(){
				expect(geneExon.getOnlyContainsDoNotCallAlways()).toEqual(false);
			});

			// TODO: Manage a doNotCall + variants for the true return
		});
	});
});