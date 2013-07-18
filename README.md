User interface AngularJS app for HEAP, HLA Epitope Analysis Program, for ClinImmune Labs at the University of Colorado.
App written by Sara Cagle and Lucas Simon.


---

Users will upload a CSV file into the browser. This file will contain user patient that includes the Subject_ID, Dx, race, and loci. Other information may be included, but these pieces of data must be in this order.
For example:\n
Subject_ID, Dx, Age of Onset, Race, DBQ1 1, etc\n
is okay, but\n
Subject_ID, race, Dx, DBQ1, etc\n
is disallowed.

An example CSV file is included for testing purposes and to examine the formating.

CSV files must not be jagged. All entries must have a corresponding header. Stray pieces of data are disallowed. Specific newline characters are also disallowed in the patient data. Blanks or missing data is allowed.

Once uploaded, CSV data will appear in the spreadsheet. Green indicates no data was given, or that the data is of an acceptable length. If more data is available, it should be included here. Blue indicates that the data was more accurate than HEAP could handle, and will be truncated upon submission to the server. It has been chopped in its display on the spreadsheet and the user does not have to edit it--it is merely blue to alert the user of the change. Red indicates that the data could be more accurate, and if available, more accurate data should be input.

Ideally, all boxes should be blue or green with data.
