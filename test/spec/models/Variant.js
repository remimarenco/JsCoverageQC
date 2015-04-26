'use strict';

describe('Variant', function(){
	var Variant;
	var tsvDataLines;
	var tsvHeadingLine;

	var reqTsv_readyState;
	var reqTsv_status;
	var reqDoNotCall_readyState;
	var reqDoNotCall_status;
	var done_emitted;

	function tsv_Upload(done){
		var tsvFile = "http://localhost:8080/base/test/data/sample.variant.tsv";

		var reqTsv = new XMLHttpRequest();
		reqTsv.open("GET", tsvFile, true);
		reqTsv.responseType = "text";

		reqTsv.onreadystatechange = function (oEvent) {
			reqTsv_readyState = reqTsv.readyState;
			reqTsv_status = reqTsv.status;

			if (reqTsv_readyState === 4 && (reqTsv_status === 200 || reqTsv_status === 0) && !done_emitted) {
				var tsvText = reqTsv.responseText; // Note: not oReq.responseText
				var tsvLines = tsvText.split('\n');
				tsvHeadingLine = tsvLines[0];
				/** @type {Array} We get the DataLines from tsvLines[1] to tsvLines[LastIndexElement] */
				tsvDataLines = tsvLines.slice(1,tsvLines.length);

				// We also check if the DoNotCall has been fully uploaded
				// If yes, we can begin all the tests
				/*
				if(reqDoNotCall_readyState === 4 && (reqDoNotCall_status === 200 || reqDoNotCall_status === 0) && !done_emitted)
				{
					done();
					done_emitted = true;
				}
				*/
				done();
			}
		};

		reqTsv.send(null);
	}

	function doNotCall_Upload(done){
		var doNotCallFile = "http://localhost:8080/base/test/data/Do%20not%20call_26.20140716.list.xlsx";

		var reqDoNotCall = new XMLHttpRequest();
		reqDoNotCall.open("GET", doNotCallFile, true);
		reqDoNotCall.responseType = "arraybuffer";

		reqDoNotCall.onreadystatechange = function (oEvent) {
			reqDoNotCall_readyState = reqDoNotCall.readyState;
			reqDoNotCall_status = reqDoNotCall.status;

			if (reqDoNotCall_readyState === 4 && (reqDoNotCall_status === 200 || reqDoNotCall_status === 0) && !done_emitted) {
				var arraybuffer = reqDoNotCall.response;

				/* convert data to binary string */
				var data = new Uint8Array(arraybuffer);
				var arr = [];
				for(var i = 0; i !== data.length; ++i){
					arr[i] = String.fromCharCode(data[i]);
				}
				var bstr = arr.join("");

				/* Call XLSX */
				// TODO: Implement SheetJs/js-xlsx
				// var workbook = XLSX.read(bstr, {type:"binary"});

				/* DO SOMETHING WITH workbook HERE */
				}

				// We also check if the tsv has been fully uploaded
				// If yes, we can begin all the tests
				if(reqTsv_readyState === 4 && (reqTsv_status === 200 || reqTsv_status === 0)  && !done_emitted)
				{
					done();
					done_emitted = true;
				}
		};

		reqDoNotCall.send(null);
	}

	beforeEach(function(done){
		Variant = require('models/Variant');

		done_emitted = false;

		tsv_Upload(done);
		//doNotCall_Upload(done);
	});

	it('should load beforeEach properly', function(){
		expect(tsvHeadingLine).not.toEqual('');
		expect(tsvDataLines.length).not.toEqual(0);
	});

	it('should construct properly with only tsv parameters', function(){
		var randomInteger_0_7 = Math.floor((Math.random() * 7) + 1);
		var variant = new Variant(tsvHeadingLine, tsvDataLines[randomInteger_0_7]);

		expect(variant).not.toBe(null);
		expect(variant).not.toEqual('undefined');
		expect(variant).toEqual(jasmine.any(Variant));
	});
});