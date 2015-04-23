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
	var fields = bedLine.split("\t");
	this.chr = fields[0];

	// Using the radix to simulate Long
	// (based on this : http://stackoverflow.com/questions/5450012/how-to-convert-a-string-to-long-in-javascript)
	this.startPos = parseInt(fields[1], 10) + 1;
	this.endPos = parseInt(fields[2], 10) + 0;
	this.name = fields[3];
}

Amplicon.prototype = {
	compareTo: function(otherAmplicon){
		// If the chromosome is different, we return the comparison
		// Else we return the startPos comparison
		var localCompareChr = this.chr.localCompare(otherAmplicon.chr);
		if(localCompareChr !== 0){
			return localCompareChr;
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