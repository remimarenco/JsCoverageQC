'use strict';

describe('Bin', function(){
	var Bin;
	var bin;

	var startCount = 10;
	var endCount = 20;
	var name = "BinName";

	beforeEach(function(){
	  Bin = require('models/Bin.js');

	  startCount = 10;
	  endCount = 20;
	  name = "BinName";

	  bin = new Bin(startCount, endCount, name);
	});

	it('should construct properly with good parameters', function(){
		expect(bin.startCount).toEqual(startCount);
		expect(bin.endCount).toEqual(endCount);
		expect(bin.name).toEqual(name);
	});

	describe('and its function', function(){

		describe('addCount', function(){
			it('should have an addCount function', function(){
				expect(bin.addCount).toBeDefined();
			});

			it('should increment the count when addCount is called', function(){
				var oldCount = bin.count;
				bin.addCount();
				expect(bin.count).toEqual(oldCount + 1);
			});

			it('should increment the count when addCount is called', function(){
				var oldCount = bin.count;
				bin.addCount();
				expect(bin.count).toEqual(oldCount + 1);
			});
		});

		describe('processPct', function(){
			it('should have a processPct function', function(){
				expect(bin.processPct).toBeDefined();
			});

			it('should have the same output than the ones tested in the Java Program', function(){
				var result_one_inJavaProgram = 1;
				var count_one = 1;
				var geneExon_endPos_one = 105246558;
				var geneExon_codingRegion_endPos_one = 105246553;
				var geneExon_startPos_one = 105246420;
				var geneExon_codingRegion_startPos_one = 105246426;

				bin.count = count_one;
				bin.processPct(geneExon_endPos_one, geneExon_codingRegion_endPos_one,
					geneExon_startPos_one, geneExon_codingRegion_startPos_one);
				expect(bin.pct).toEqual(result_one_inJavaProgram);

				var result_two_inJavaProgram = 9;
				var count_two = 12;
				var geneExon_endPos_two = 105246558;
				var geneExon_codingRegion_endPos_two = 105246553;
				var geneExon_startPos_two = 105246420;
				var geneExon_codingRegion_startPos_two = 105246426;

				bin.count = count_two;
				bin.processPct(geneExon_endPos_two, geneExon_codingRegion_endPos_two,
					geneExon_startPos_two, geneExon_codingRegion_startPos_two);
				expect(bin.pct).toEqual(result_two_inJavaProgram);

				var result_three_inJavaProgram = 14;
				var count_three = 8;
				var geneExon_endPos_three = 29443706;
				var geneExon_codingRegion_endPos_three = 29443701;
				var geneExon_startPos_three = 29443643;
				var geneExon_codingRegion_startPos_three = 29443573;

				bin.count = count_three;
				bin.processPct(geneExon_endPos_three, geneExon_codingRegion_endPos_three,
					geneExon_startPos_three, geneExon_codingRegion_startPos_three);
				expect(bin.pct).toEqual(result_three_inJavaProgram);
			});
		});
	});
});