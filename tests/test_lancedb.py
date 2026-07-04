from scholarai.storage import vectors
try:
    tbl = vectors._open_table()
    tbl.create_fts_index("text", replace=True)
    print("Success with string")
except Exception as e:
    print("Error with string:", e)
