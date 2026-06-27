import fitz

r1 = fitz.Rect(0, 0, 100, 100)
r2 = fitz.Rect(50, 50, 150, 150)

intersect = fitz.Rect(r1).intersect(r2)
print("intersect:", intersect)
print("r1:", r1)

r3 = fitz.Rect(0, 0, 100, 100)
intersect2 = r3 & r2
print("intersect2:", intersect2)
print("r3:", r3)

