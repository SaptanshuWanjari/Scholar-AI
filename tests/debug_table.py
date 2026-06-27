import fitz

doc = fitz.open("data/uploads/86be6f2a_Microservices From Design to Deploy.pdf")
page = doc[21]
tables_res = page.find_tables()
for tbl in getattr(tables_res, "tables", []):
    print("Extracted data:")
    for row in tbl.extract():
        print(row)
