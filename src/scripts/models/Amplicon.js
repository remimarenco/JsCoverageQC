'use strict';

function Amplicon(bedLine){
	// TODO:
	// - See how to implement the comparable java like in javascript => implements Comparable<Object>
	// - More protections on the bedLine received (check there are 4 tabs)
	// - Do not forget to see if the class prototype is compatible with XSL/XMLAnnotation

	// Variable declaration
	this.chr = "";
	this.startPos = -1;
	this.endPos = -1;
	this.name = "";

	// populate in the java file Amplicon.java
	if(bedLine !== null && typeof bedLine !== 'undefined'){
		var fields = bedLine.split("\t");
		this.chr = fields[0];

		// Using the radix to simulate Long
		// (based on this : http://stackoverflow.com/questions/5450012/how-to-convert-a-string-to-long-in-javascript)
		this.startPos = parseInt(fields[1], 10) + 1;
		this.endPos = parseInt(fields[2], 10) + 0;
		this.name = fields[3];
	}
}

Amplicon.prototype = {
	equals: function(otherAmplicon){
		if(this.compare(otherAmplicon) === 0){
			return true;
		}
		return false;
	},
	compare: function(otherAmplicon){
		// If the chromosome is different, we return the comparison
		// Else we return the startPos comparison
		var localeCompareChr = this.chr.localeCompare(otherAmplicon.chr);
		if(localeCompareChr !== 0){
			// Get the int part on the chromosomes
			var re = /(\d+)/;
			var foundThisChr = this.chr.match(re);
			var foundOtherChr = otherAmplicon.chr.match(re);

			var intThisChr = parseInt(foundThisChr[1]);
			var intOtherChr = parseInt(foundOtherChr[1]);

			// Compare the two ints
			if(intThisChr < intOtherChr){
				return -1;
			}
			else if(intThisChr === intOtherChr){
				return 0;
			}
			else{
				return 1;
			}

			return localeCompareChr;
		}
		else{
			if(this.startPos < otherAmplicon.startPos){
				return -1;
			}
			else if(this.startPos === otherAmplicon.startPos){
				return 0;
			}
			else{
				return 1;
			}
		}
	}
};

module.exports = Amplicon;