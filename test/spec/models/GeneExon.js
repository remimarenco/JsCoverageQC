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
});