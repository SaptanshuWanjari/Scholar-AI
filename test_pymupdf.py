import fitz
print("fitz loaded")
doc = fitz.open("data/uploads/86be6f2a_Microservices From Design to Deploy.pdf")
page = doc[0]
page_dict = page.get_text("dict", sort=True)
print("page processed")
