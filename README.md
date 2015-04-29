# JsCoverageQC
A javascript adaptation of CoverageQC (https://github.com/ghsmith/coverageQc), for Galaxy Project

- Don't forget to use npm install in the directory, once you downloaded the project, to install all the dependencies
- If this error is shown while launching the server : "ERROR in ./~/xlsx/dist/cpexcel.js
Module not found: Error: Cannot resolve 'file' or 'directory' ./cptable in xyz/node_modules/xlsx/dist
 @ ./~/xlsx/dist/cpexcel.js 807:16-41
" => use this : https://github.com/SheetJS/js-xlsx/issues/76 and only keep "cptable = factory(cptable);" in cpexcel.js line 803-809
