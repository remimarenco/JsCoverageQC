var geneExonDescription = {
	name: 'GeneExon',
	typeInfos: [{
		type: 'classInfo',
		localName: 'geneExonType',
		propertyInfos: [{
			type: 'attribute',
			name: 'chr',
			'attributeName': 'chr',
			typeInfo: 'String'
		}]
	}],
	elementInfos: [{
		elementName: 'geneExon',
		typeInfo: 'geneExonType'
	}]
};

var vcfDescription = {
	name: 'VCF',
	typeInfos: [{
		type: 'classInfo',
		localName: 'VCFType',
		propertyInfos: [{
			type: 'attribute',
			name: 'fileUrl',
			attributeName: 'fileUrl',
			typeInfo: 'String',
		}, {
			type: 'attribute',
			name: 'exonBedFileUrl',
			attributeName: 'exonBedFileUrl',
			typeInfo: 'String'
		}, {
			type: 'attribute',
			name: 'ampliconBedFileUrl',
			attributeName: 'ampliconBedFileUrl',
			typeInfo: 'String'
		}, {
			type: 'attribute',
			name: 'variantTsvFileUrl',
			attributeName: 'variantTsvFileUrl',
			typeInfo: 'String'
		}, {
			type: 'attribute',
			name: 'variantTsvFileLineCount',
			attributeName: 'variantTsvFileLineCount',
			typeInfo: 'Int'
		}, {
			type: 'attribute',
			name: 'runDate',
			attributeName: 'runDate',
			typeInfo: 'Date'
		}, {
			type: 'attribute',
			name: 'ampliconCount',
			attributeName: 'ampliconCount',
			typeInfo: 'Int'
		}, {
			type: 'attribute',
			name: 'baseCount',
			attributeName: 'baseCount',
			typeInfo: 'Int'
		}, {
			type: 'attribute',
			name: 'filteredAnnotatedVariantCount',
			attributeName: 'filteredAnnotatedVariantCount',
			typeInfo: 'Int'
		}, {
			type: 'attribute',
			name: '__proto__.getReadDepthCount()',
			attributeName: '__proto__.getReadDepthCount()',
			typeInfo: 'Int'
		}, {
			type: 'element',
			name: 'geneExons',
			elementName: 'geneExons',
			typeInfo: 'VCF.GeneExons'
		}]
	}, {
		type: 'classInfo',
		localName: 'GeneExons',
		propertyInfos: [{
			type: 'element',
			name: 'geneExon',
			collection: 'true',
			elementName: 'geneExon',
			typeInfo: 'VCF.GeneExon'
		}]
	}, {
		type: 'classInfo',
		localName: 'GeneExon',
		propertyInfos: geneExonDescription.typeInfos.propertyInfos
	}],
	elementInfos: [{
        elementName: 'vcf',
        typeInfo: 'VCF.VCFType'
    }]
};

module.exports = vcfDescription;