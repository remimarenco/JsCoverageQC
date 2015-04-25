'use strict';

// SimpleSets to manage HashSet used in the Java version
var cSet = require('collections/set');
var cSortedMap = require("collections/sorted-map");

describe('Base', function(){
	var Base;
	var vcfLines;

	beforeEach(function(done){
		Base = require('models/Base.js');

		var vcfFile = "http://localhost:8080/base/test/data/sample.genome.vcf";

		var req = new XMLHttpRequest();
		req.open("GET", vcfFile, true);
		req.responseType = "text";

		req.onreadystatechange = function (oEvent) {
		  if (req.readyState === 4 && (req.status === 200 || req.status === 0)) {
		    var vcfText = req.responseText; // Note: not oReq.responseText
		    vcfLines = vcfText.split('\n');
		    done();
		  }
		};

		req.send(null);
	});

	it('should construct properly with good parameters passed, without S13-25877-A to 0/1', function(){
		var base = new Base(vcfLines[35], new cSortedMap());
		expect(base.chr).toEqual('chr1');
		expect(base.pos).toEqual(115251148);
		expect(base.variant).toEqual('');
		expect(base.variantText).toEqual('');
		expect(base.quality).toEqual('');
		expect(base.filter).toEqual('');
	});

	it('should construct properly with good parameters passed, with S13-25877-A to 0/1', function(){
		var base = new Base(vcfLines[787], new cSortedMap());
		expect(base.chr).toEqual('chr2');
		expect(base.pos).toEqual(48030639);
		expect(base.variant).toEqual('X>X');
		expect(base.variantText).toEqual('48030639: X>X (reads: 1132>43, filter: PB, qual: 100)');
		expect(base.quality).toEqual('');
		expect(base.filter).toEqual('');
	});

	//TODO: Check with a bases object, need Vcf and GeneExon first

	describe('and its function', function(){
		var base;
		var otherBaseEqual;
		var otherBase;

		beforeEach(function(){
			base = new Base();
			otherBaseEqual = new Base();
			otherBase = new Base(vcfLines[787], new cSortedMap());
		});
		describe('compareTo',function(){
			it('should be defined', function(){
				expect(base.compareTo).toBeDefined();
			});

			it('should be 0 with two identical objects', function(){
				expect(base.compareTo(otherBaseEqual)).toEqual(0);
			});

			it('should be not 0 with two different objects', function(){
				expect(base.compareTo(otherBase)).not.toEqual(0);
			});
		});

		describe('getTotalReadDepth', function(){
			it('should be defined', function(){
				expect(base.getTotalReadDepth).toBeDefined();
			});

			it('should return 0 on an empty base object', function(){
				expect(base.getTotalReadDepth()).toEqual(0);
			});

			it('should return the only readDepth of the vcfLine on an Base with vcfLine and no bases', function(){
				expect(otherBase.getTotalReadDepth()).toEqual(1175);
			});

			// TODO: Create an object with bases to get some readDepth
		});
	});
});