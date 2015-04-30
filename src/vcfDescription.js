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
			name: 'readDepthCount',
			attributeName: 'readDepthCount',
			typeInfo: 'Int'
		}]
	}],
	elementInfos: [{
        elementName: 'vcf',
        typeInfo: 'VCF.VCFType'
    }]
};

module.exports = vcfDescription;