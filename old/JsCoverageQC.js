/* TODO:
	- Récupérer des fichiers en js client only
	- Faire le découpage en classe comme coverageQC + Faire algo main Java -> Javascript
	- Etablir une sortie pour vérifier que les données sont ok comme Java
	- Faire le html qui correspond
	- Utiliser les libs identiques pour faire le boulot

	- doNotCallFile à traiter plus tard
 */

"use strict";

function getFile(htmlIdName){
	var fileInput = document.getElementById(htmlIdName);
	//var fileDisplayArea = document.getElementById('fileDisplayArea');

	var reader = new FileReader();

	fileInput.addEventListener('change', function(e){
		var file = fileInput.files[0];

		// When the file is loaded
		reader.onload = function(e){
			//fileDisplayArea.innerText = reader.result;
			//alert("File loaded!");
		};

		reader.readAsText(file);
	});

	return reader;
}

function getParameters(){
	var readerVcfFile = getFile("vcfFile");
	var readerExonFile = getFile("exonFile");
	var readerAmpliconFile = getFile("ampliconFile");
	var readerDoNotCallFile = getFile("doNotCallFile");
	var readerVariantTsv = getFile("variantTsv");

	var parameters = [];

	parameters.vcf = readerVcfFile;
	parameters.exon = readerExonFile;
	parameters.amplicon = readerAmpliconFile;
	parameters.doNotCallFile = readerDoNotCallFile;
	parameters.readerVariantTsv = readerVariantTsv;

	return parameters;
}

function generateReport(){

}

window.onload = function(){
	// We can set a boolean to true when ok for processing files
	var parameters = getParameters();

	var ProcessInput = document.getElementById("Process");
	ProcessInput.addEventListener('click', function(e){
			// To process, we first need to check we have all the files
			if((parameters.vcf && parameters.exon && parameters.amplicon) &&
			 (parameters.vcf.readyState === 2 && parameters.exon.readyState === 2 && parameters.amplicon.readyState === 2))
			{
				console.log("C'est good!");
				generateReport();
			}
			else
			{
				// TODO: Find a better way to show messages to the user
				alert("One of the necessaries files (VCF, Exon ou Aplicon) are not yet loaded. Please load them first before process.");
			}
		});
};