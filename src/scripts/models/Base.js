'use strict';

// SimpleSets to manage HashSet used in the Java version
var cSet = require('collections/set');

function Base(vcfLine, bases){
	this.chr = '';
	this.pos = -1;
	// readDepths is a map of Long
	this.readDepths = new cSet();

	this.variant = '';
	this.variantText = '';
	this.quality = '';
	this.filter = '';

	var fields = vcfLine.split("\t");
	var chr = fields[0];
	var pos = parseInt(fields[1]);
	var readDepth = parseInt(fields[7].substring(3));
	var variant = null;
	if(fields[9].substring(0,3).equals("0/1") || fields[9].substring(0,3).equals("1/1")){
		variant = fields[3] + ">" + fields[4];
	}
	// TODO: Check if a treemap exists in Javascript, else find a way to modify it in this prototype,
	// in the main JsCoverageQcApp and in the Vcf Model
	// TODO: Find a clone function to copy bases.get(...) into this
	var newBase = bases.get(chr + "|" + pos.toString());
	if(newBase === null){
		newBase.chr = chr;
		newBase.pos = pos;
		bases.put(chr + "|" + pos.toString(), newBase);
	}
	newBase.readDepths.add(readDepth);

	if(variant !== null){
		newBase.variant = (newBase === null ? "" : newBase.variant + ", ") + variant;
		var quality = Math.round(parseFloat(fields[5]));
		var filter = fields[6];
		var refReads = parseInt(fields[9].split(":")[2].split(",")[0]);
		var altReads = parseInt(fields[9].split(":")[2].split(",")[1]);
		newBase.variantText = (newBase.variantText === null ? pos + ": " : newBase.variantText + ", ") +
			"" +
			variant +
			" (" +
			"reads: " + refReads + ">" + altReads +
			", filter: " + filter +
			", qual: " + quality +
			")";
	}

	// TODO: Delete this part by cloning the bases.get(...) into this
	this.chr = newBase.chr;
	this.pos = newBase.pos;
	this.readDepths = newBase.readDepths;

	this.variant = newBase.variant;
	this.variantText = newBase.variantText;
	this.quality = newBase.quality;
	this.filter = newBase.filter;
}

Base.prototype = {
	compareTo: function(otherBase){
		if(this.pos < otherBase.pos){
			return -1;
		}
		else if(this.pos === otherBase.pos){
			return 0;
		}
		else{
			return 1;
		}
	},
    getTotalReadDepth: function(){
    	var totalReadDepth = 0;
    	this.readDepths.forEach(function(readDepth){
    		if(readDepth > totalReadDepth){
    			totalReadDepth = readDepth;
    		}
    	});
    }
};

module.exports = Base;