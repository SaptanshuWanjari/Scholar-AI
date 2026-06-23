# Operating Systems — Memory Management

## Paging

Paging divides physical memory into fixed-size frames and logical memory
into pages of the same size. Each process has a page table mapping virtual
pages to physical frames. Key benefits:

- No external fragmentation
- Contiguous virtual address space mapped to non-contiguous physical frames
- Simplifies memory allocation

The page table is stored in main memory. A Translation Lookaside Buffer
(TLB) caches recent translations to reduce the overhead.

## Segmentation

Segmentation divides memory into variable-sized logical segments (code,
stack, heap, data). Each segment has a base and limit register. Unlike
paging, segmentation matches the programmer's view of memory.

Key differences from paging:

- Segments are variable size; pages are fixed size
- Segmentation suffers from external fragmentation; paging does not
- Paging requires complex hardware (TLB, multi-level page tables)
- Segmentation provides natural sharing and protection at segment level

### Comparison Table

| Feature | Paging | Segmentation |
|---------|--------|-------------|
| Unit | Fixed-size pages | Variable-size segments |
| Fragmentation | Internal only | External |
| Hardware support | TLB, page tables | Base/limit registers |
| Programmer visibility | Transparent | Visible to programmer |
