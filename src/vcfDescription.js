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
		}]
	}]
};

module.exports = vcfDescription;