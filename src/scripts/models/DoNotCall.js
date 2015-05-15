'use strict';

function DoNotCall(xslxHeadingRow, xslxDataRow, calltype){
    var ensp;
    var hgvsc;
    var callType;
    var transcript;
    var coordinate;

    var columnNumber;
    var cellIndex;
    var headerArray;
    var heading; // new HashMap<String, Integer>();

/*
            Iterator<Cell> cellIterator = xslxHeadingRow.cellIterator();
            while (cellIterator.hasNext())
            {
                Cell cell = cellIterator.next();
                        cellIndex = cell.getColumnIndex();
                        switch (cell.getCellType()) {
                        case Cell.CELL_TYPE_BOOLEAN:
                            headerArray[cellIndex] = Boolean.toString(cell
                                    .getBooleanCellValue());
                            break;
                        case Cell.CELL_TYPE_NUMERIC:
                            headerArray[cellIndex] = Double.toString(cell
                                    .getNumericCellValue());
                            break;
                        case Cell.CELL_TYPE_STRING:
                            headerArray[cellIndex] = cell.getStringCellValue();
                            break;
                        default:
                            headerArray[cellIndex] = "";
                        }

            }//end while celliterator

            for (int x = 0; x < headerArray.length; x++) {
            headings.put(headerArray[x].substring(0,headerArray[x].indexOf("_")), x);
                    }

            //String[] dataArray = xslxDataLine.split("\t");
            if(xslxDataRow.getCell(headings.get("HGVSc"))!=null)
            {
                donotcall.hgvsc = xslxDataRow.getCell(headings.get("HGVSc").intValue()).getStringCellValue();
            }
            //donotcall.hgvsp = xslxDataRow.getCell(headings.get("HGVSp").intValue()).getStringCellValue();
            if(xslxDataRow.getCell(headings.get("ENSP"))!=null)
            {
                donotcall.ensp = xslxDataRow.getCell(headings.get("ENSP").intValue()).getStringCellValue();
            }
            if(xslxDataRow.getCell(headings.get("Transcript"))!=null)
            {
                donotcall.transcript = xslxDataRow.getCell(headings.get("Transcript").intValue()).getStringCellValue();
            }else
            {
                System.out.println("Transcript_27 column entry is negative!  This is essential to do not call! Do not call list needs to be fixed!  Crashing to prevent abnormal behavior!");
                        System.exit(1);
            }
            donotcall.coordinate = (long)xslxDataRow.getCell(headings.get("Coordinate").intValue()).getNumericCellValue();

            // CallType is the page of the xlsx :
            // 1 => Always_Not_Real
            // 2 => Not_Real_When_Percentage_Low
            // 3 => Undetermined_Importance
            if(calltype==1)
            {
                donotcall.callType="Don't call, always";
            }else if (calltype==2)
            {
                donotcall.callType="If percentage low, don't call";
            }else
            {
                donotcall.callType= "On lab list, Unknown significance";
            }

            return donotcall;
*/
}

DoNotCall.prototype = {

};

module.exports = DoNotCall;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
package coverageqc.data;

import java.util.HashMap;
import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;

@XmlRootElement
public class DoNotCall {
    //key inheritance
    //public String hgvscComplete;
    @XmlAttribute
    public String ensp;
    @XmlAttribute
    public String hgvsc;
   // @XmlAttribute
   // public String hgvsp;
    @XmlAttribute
    public String callType;
     @XmlAttribute
    public String transcript;
      @XmlAttribute
    public Long coordinate;

   // @XmlAttribute
    public static DoNotCall populate(Row xslxHeadingRow, Row xslxDataRow, Integer calltype)
    {
        DoNotCall donotcall = new DoNotCall();
        int columnNumber;
	int cellIndex;
        String[] headerArray;
	HashMap<String, Integer> headings = new HashMap<String, Integer>();

        columnNumber = xslxHeadingRow.getLastCellNum();
	headerArray = new String[columnNumber];

        Iterator<Cell> cellIterator = xslxHeadingRow.cellIterator();
        while (cellIterator.hasNext())
        {
            Cell cell = cellIterator.next();
					cellIndex = cell.getColumnIndex();
					switch (cell.getCellType()) {
					case Cell.CELL_TYPE_BOOLEAN:
						headerArray[cellIndex] = Boolean.toString(cell
								.getBooleanCellValue());
						break;
					case Cell.CELL_TYPE_NUMERIC:
						headerArray[cellIndex] = Double.toString(cell
								.getNumericCellValue());
						break;
					case Cell.CELL_TYPE_STRING:
						headerArray[cellIndex] = cell.getStringCellValue();
						break;
					default:
						headerArray[cellIndex] = "";
					}

        }//end while celliterator

        for (int x = 0; x < headerArray.length; x++) {
		headings.put(headerArray[x].substring(0,headerArray[x].indexOf("_")), x);
				}


        //String[] dataArray = xslxDataLine.split("\t");
        if(xslxDataRow.getCell(headings.get("HGVSc"))!=null)
        {
        donotcall.hgvsc = xslxDataRow.getCell(headings.get("HGVSc").intValue()).getStringCellValue();

        }
        //donotcall.hgvsp = xslxDataRow.getCell(headings.get("HGVSp").intValue()).getStringCellValue();
        if(xslxDataRow.getCell(headings.get("ENSP"))!=null)
        {
        donotcall.ensp = xslxDataRow.getCell(headings.get("ENSP").intValue()).getStringCellValue();
        }
        if(xslxDataRow.getCell(headings.get("Transcript"))!=null)
        {
        donotcall.transcript = xslxDataRow.getCell(headings.get("Transcript").intValue()).getStringCellValue();
        }else
        {
            System.out.println("Transcript_27 column entry is negative!  This is essential to do not call! Do not call list needs to be fixed!  Crashing to prevent abnormal behavior!");
                    System.exit(1);
        }
        donotcall.coordinate = (long)xslxDataRow.getCell(headings.get("Coordinate").intValue()).getNumericCellValue();

        // CallType is the page of the xlsx :
        // 1 => Always_Not_Real
        // 2 => Not_Real_When_Percentage_Low
        // 3 => Undetermined_Importance
        if(calltype==1)
        {
            donotcall.callType="Don't call, always";
        }else if (calltype==2)
        {
            donotcall.callType="If percentage low, don't call";

        }else
        {
            donotcall.callType= "On lab list, Unknown significance";
        }

        return donotcall;
    }
}
*/