import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  PaperTable,
  TableHeader,
  PaperTh,
  TableRow,
  TableCell,
  EmptyTable,
  Pagination,
} from '@paper-ui/components/tables';
import { StatusBadge, DifficultyBadge, TypeTag } from '@paper-ui/components/badges';
import { SketchButton } from '@paper-ui/components/buttons';
import {
  TableFooter,
  TableCaption,
  TableToolbar,
  TableSearch,
  TableFilter,
  TableSelection,
  ColumnVisibility,
} from '@paper-ui/components/tables';
import { Paper } from '@paper-ui/components/paper';
import { SunDoodle, StarDoodle } from '@paper-ui/components/doodles';
import { Tape, PushPin } from '@paper-ui/components/decorations';
import {
  Eye,
  Trash2,
  ArrowUpDown,
  Search,
  Download,
  Share2,
} from 'lucide-react';

const meta = {
  title: 'Components/Composed/Table',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const DOCS = [
  { id: 1, title: 'Attention Is All You Need', type: 'pdf', status: 'indexed' as const, size: '2.4 MB', pages: 12 },
  { id: 2, title: 'Linear Algebra Notes', type: 'md', status: 'processing' as const, size: '48 KB', pages: null },
  { id: 3, title: 'Calculus Textbook', type: 'pdf', status: 'failed' as const, size: '15 MB', pages: 432 },
  { id: 4, title: 'Data Structures & Algorithms', type: 'pdf', status: 'indexed' as const, size: '5.1 MB', pages: 280 },
  { id: 5, title: 'Introduction to ML', type: 'docx', status: 'indexed' as const, size: '1.2 MB', pages: 64 },
];

export const BasicTable = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const toggle = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div className="p-10 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold mb-4">PaperTable — sortable & selectable</h2>
      <div className="max-w-3xl">
        <PaperTable striped>
          <TableHeader>
            <tr>
              <PaperTh style={{ width: 40 }}>#</PaperTh>
              <PaperTh>Title</PaperTh>
              <PaperTh>Type</PaperTh>
              <PaperTh>Status</PaperTh>
              <PaperTh className="text-right">Size</PaperTh>
              <PaperTh className="text-right" style={{ width: 80 }}>Actions</PaperTh>
            </tr>
          </TableHeader>
          <tbody>
            {DOCS.map((doc, i) => (
              <TableRow
                key={doc.id}
                index={i}
                selected={selected.includes(doc.id)}
                onClick={() => toggle(doc.id)}
              >
                <TableCell muted>{doc.id}</TableCell>
                <TableCell><span className="font-kalam font-bold text-ink">{doc.title}</span></TableCell>
                <TableCell><TypeTag type={doc.type} /></TableCell>
                <TableCell><StatusBadge status={doc.status} /></TableCell>
                <TableCell align="right" muted>{doc.size}</TableCell>
                <TableCell align="right">
                  <div className="flex gap-1 justify-end">
                    <SketchButton size="sm"><Eye size={12} /></SketchButton>
                    <SketchButton size="sm"><Trash2 size={12} /></SketchButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </PaperTable>
      </div>
      {selected.length > 0 && (
        <p className="mt-2 font-architect text-xs text-ink-muted">Selected: {selected.join(', ')}</p>
      )}
    </div>
  );
};

export const EmptyTableExample = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">EmptyTable</h2>
    <div className="max-w-xl">
      <PaperTable>
        <TableHeader>
          <tr>
            <PaperTh>Title</PaperTh>
            <PaperTh>Type</PaperTh>
            <PaperTh>Status</PaperTh>
          </tr>
        </TableHeader>
        <tbody>
          <EmptyTable
            colSpan={3}
            message="No documents found"
            hint="Try uploading a PDF or adjusting your filters."
            action={<SketchButton size="sm">Upload Document</SketchButton>}
          />
        </tbody>
      </PaperTable>
    </div>
  </div>
);

export const PaginationExample = () => {
  const [page, setPage] = useState(3);
  return (
    <div className="p-10 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold mb-4">Pagination</h2>
      <div className="space-y-6 max-w-lg">
        <Pagination page={page} totalPages={10} onPageChange={setPage} />
        <Pagination page={1} totalPages={5} onPageChange={() => {}} />
        <Pagination page={1} totalPages={1} onPageChange={() => {}} />
        <p className="font-mono text-xs text-gray-500">Current page: {page}</p>
      </div>
    </div>
  );
};

const FLASHCARD_DATA = [
  { id: 1, front: 'What is a gradient?', difficulty: 'Medium' as const, due: 'Today', score: '72%' },
  { id: 2, front: 'Define eigenvalue', difficulty: 'Hard' as const, due: 'Tomorrow', score: '45%' },
  { id: 3, front: 'What is softmax?', difficulty: 'Easy' as const, due: 'In 3 days', score: '95%' },
  { id: 4, front: 'Explain backprop', difficulty: 'Hard' as const, due: 'In 7 days', score: '61%' },
];

export const FlashcardTable = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">Flashcard table — real-world example</h2>
    <div className="max-w-2xl">
      <PaperTable>
        <TableHeader>
          <tr>
            <PaperTh>Concept</PaperTh>
            <PaperTh>Difficulty</PaperTh>
            <PaperTh>Due</PaperTh>
            <PaperTh className="text-right">Confidence</PaperTh>
          </tr>
        </TableHeader>
        <tbody>
          {FLASHCARD_DATA.map((fc, i) => (
            <TableRow key={fc.id} index={i}>
              <TableCell><span className="font-kalam font-bold text-ink">{fc.front}</span></TableCell>
              <TableCell><DifficultyBadge difficulty={fc.difficulty} /></TableCell>
              <TableCell muted>{fc.due}</TableCell>
              <TableCell align="right">
                <span className="font-caveat text-lg font-bold text-ink">{fc.score}</span>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </PaperTable>
    </div>
  </div>
);

export const WithFooter = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">TableFooter</h2>
    <div className="max-w-2xl">
      <PaperTable>
        <TableHeader>
          <tr>
            <PaperTh>Item</PaperTh>
            <PaperTh className="text-right">Qty</PaperTh>
            <PaperTh className="text-right">Price</PaperTh>
          </tr>
        </TableHeader>
        <tbody>
          {[
            { item: 'Notebook', qty: 3, price: '$12.99' },
            { item: 'Pencils', qty: 12, price: '$4.50' },
            { item: 'Eraser', qty: 2, price: '$1.99' },
          ].map((row, i) => (
            <TableRow key={i} index={i}>
              <TableCell>{row.item}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
            </TableRow>
          ))}
        </tbody>
        <TableFooter>
          <tr>
            <TableCell muted>Total items: 3</TableCell>
            <TableCell align="right" muted>17</TableCell>
            <TableCell align="right">
              <span className="font-architect font-bold text-ink">$19.48</span>
            </TableCell>
          </tr>
        </TableFooter>
      </PaperTable>
    </div>
  </div>
);

export const WithCaption = () => (
  <div className="p-10 bg-[#f4f1ea] space-y-10">
    <div>
      <h2 className="font-serif text-xl font-bold mb-2">Caption below (default)</h2>
      <div className="max-w-lg">
        <PaperTable>
          <TableCaption>A list of recent study materials uploaded this week</TableCaption>
          <TableHeader>
            <tr>
              <PaperTh>Title</PaperTh>
              <PaperTh>Type</PaperTh>
            </tr>
          </TableHeader>
          <tbody>
            {DOCS.slice(0, 3).map((doc, i) => (
              <TableRow key={doc.id} index={i}>
                <TableCell>{doc.title}</TableCell>
                <TableCell><TypeTag type={doc.type} /></TableCell>
              </TableRow>
            ))}
          </tbody>
        </PaperTable>
      </div>
    </div>
    <div>
      <h2 className="font-serif text-xl font-bold mb-2">Caption above</h2>
      <div className="max-w-lg">
        <PaperTable>
          <TableCaption side="top">Flashcard review progress this month</TableCaption>
          <TableHeader>
            <tr>
              <PaperTh>Concept</PaperTh>
              <PaperTh>Due</PaperTh>
            </tr>
          </TableHeader>
          <tbody>
            {FLASHCARD_DATA.slice(0, 3).map((fc, i) => (
              <TableRow key={fc.id} index={i}>
                <TableCell>{fc.front}</TableCell>
                <TableCell muted>{fc.due}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </PaperTable>
      </div>
    </div>
  </div>
);

export const WithToolbar = () => {
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState<Set<string>>(new Set(['Title', 'Status', 'Date']));

  const toggleCol = (col: string) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return next;
    });
  };

  const filtered = DOCS.filter((d) =>
    !search || d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-10 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold mb-4">TableToolbar — search + columns</h2>
      <div className="max-w-2xl">
        <PaperTable>
          <TableToolbar>
            <TableSearch value={search} onChange={setSearch} placeholder="Search documents..." />
            <div className="flex-1" />
            <ColumnVisibility
              columns={['Title', 'Status', 'Date']}
              visible={visible}
              onChange={toggleCol}
            />
          </TableToolbar>
          <TableHeader>
            <tr>
              {visible.has('Title') && <PaperTh>Title</PaperTh>}
              {visible.has('Status') && <PaperTh>Status</PaperTh>}
              {visible.has('Date') && <PaperTh>Date</PaperTh>}
            </tr>
          </TableHeader>
          <tbody>
            {filtered.map((doc, i) => (
              <TableRow key={doc.id} index={i}>
                {visible.has('Title') && <TableCell>{doc.title}</TableCell>}
                {visible.has('Status') && <TableCell><StatusBadge status={doc.status} /></TableCell>}
                {visible.has('Date') && <TableCell muted>2025-06-{(10 + i).toString().padStart(2, '0')}</TableCell>}
              </TableRow>
            ))}
          </tbody>
        </PaperTable>
      </div>
    </div>
  );
};

export const WithFilter = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">TableFilter — column popover</h2>
    <div className="max-w-xl">
      <PaperTable>
        <TableHeader>
          <tr>
            <PaperTh>
              <div className="flex items-center gap-1">
                Title
                <ArrowUpDown size={12} className="text-ink-muted/60" />
              </div>
            </PaperTh>
            <PaperTh>
              <TableFilter label="Status" active>
                <div className="flex flex-col gap-1 font-architect text-[13px] text-ink">
                  {(['indexed', 'processing', 'failed'] as const).map((s) => (
                    <label key={s} className="flex items-center gap-2 px-1 py-0.5 cursor-pointer hover:bg-black/[0.03] rounded">
                      <input type="checkbox" defaultChecked className="rounded accent-[#3a3733]" />
                      <span className="capitalize">{s}</span>
                    </label>
                  ))}
                </div>
              </TableFilter>
            </PaperTh>
            <PaperTh className="text-right">Size</PaperTh>
          </tr>
        </TableHeader>
        <tbody>
          {DOCS.map((doc, i) => (
            <TableRow key={doc.id} index={i}>
              <TableCell>{doc.title}</TableCell>
              <TableCell><StatusBadge status={doc.status} /></TableCell>
              <TableCell align="right" muted>{doc.size}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </PaperTable>
    </div>
  </div>
);

export const WithSelection = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const toggleAll = () =>
    setSelected((s) => (s.length === DOCS.length ? [] : DOCS.map((d) => d.id)));

  const clear = () => setSelected([]);

  return (
    <div className="p-10 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold mb-4">TableSelection — checkboxes + toolbar</h2>
      <div className="max-w-2xl">
        {selected.length > 0 && (
          <TableSelection.Toolbar count={selected.length} onClear={clear}>
            <SketchButton size="sm"><Download size={12} /></SketchButton>
            <SketchButton size="sm"><Share2 size={12} /></SketchButton>
            <SketchButton size="sm"><Trash2 size={12} /></SketchButton>
          </TableSelection.Toolbar>
        )}
        <PaperTable>
          <TableHeader>
            <tr>
              <PaperTh style={{ width: 40 }}>
                <TableSelection.Checkbox
                  checked={selected.length === DOCS.length}
                  indeterminate={selected.length > 0 && selected.length < DOCS.length}
                  onChange={() => toggleAll()}
                />
              </PaperTh>
              <PaperTh>Title</PaperTh>
              <PaperTh>Type</PaperTh>
              <PaperTh>Status</PaperTh>
            </tr>
          </TableHeader>
          <tbody>
            {DOCS.map((doc, i) => (
              <TableRow key={doc.id} index={i} selected={selected.includes(doc.id)}>
                <TableCell>
                  <TableSelection.Checkbox
                    checked={selected.includes(doc.id)}
                    onChange={() => toggle(doc.id)}
                  />
                </TableCell>
                <TableCell>{doc.title}</TableCell>
                <TableCell><TypeTag type={doc.type} /></TableCell>
                <TableCell><StatusBadge status={doc.status} /></TableCell>
              </TableRow>
            ))}
          </tbody>
        </PaperTable>
      </div>
    </div>
  );
};

export const DoodleLayout = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState<Set<string>>(new Set(['Title', 'Status', 'Date']));
  const toggleCol = (col: string) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(col)) next.delete(col);
      else next.add(col);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      <div className="relative px-8 pt-10 pb-20">
        <div className="relative z-10 flex items-center gap-3 mb-8">
          <Tape
            variant="Ribbon"
            color="#c9954f"
            width={200}
            height={40}
          />
          <h1 className="font-caveat text-4xl font-bold text-[#3a3733] -ml-12 mt-1">
            Data Tables
          </h1>
          <Tape
            variant="Scribble"
            color="#7a9ec4"
            width={140}
            height={36}
            className="rotate-2 mt-1"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Paper
            className="relative -rotate-1 hover:rotate-0 transition-transform duration-300"
            shadow="soft"
          >
            <PushPin className="absolute -top-2 left-1/2 -translate-x-1/2 z-20" color="#c9554f" />
            <div className="absolute -top-3 -right-3 z-10">
              <SunDoodle size={38} color="#c9954f" />
            </div>
            <div className="p-4">
              <h3 className="font-caveat text-xl font-bold text-[#3a3733] mb-3 ml-0.5">Ledger</h3>
              <PaperTable>
                <TableHeader>
                  <tr>
                    <PaperTh>Item</PaperTh>
                    <PaperTh className="text-right">Qty</PaperTh>
                    <PaperTh className="text-right">Price</PaperTh>
                  </tr>
                </TableHeader>
                <tbody>
                  {[
                    { item: 'Notebook', qty: 3, price: '$12.99' },
                    { item: 'Pencils', qty: 12, price: '$4.50' },
                    { item: 'Eraser', qty: 2, price: '$1.99' },
                  ].map((row, i) => (
                    <TableRow key={i} index={i}>
                      <TableCell>{row.item}</TableCell>
                      <TableCell align="right">{row.qty}</TableCell>
                      <TableCell align="right">{row.price}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
                <TableFooter>
                  <tr>
                    <TableCell muted>Total</TableCell>
                    <TableCell align="right" muted>17</TableCell>
                    <TableCell align="right">
                      <span className="font-architect font-bold text-ink">$19.48</span>
                    </TableCell>
                  </tr>
                </TableFooter>
              </PaperTable>
            </div>
          </Paper>

          <Paper
            className="relative rotate-1 hover:rotate-0 transition-transform duration-300"
            shadow="soft"
          >
            <Tape variant="Ribbon" color="#b4ad9e" width={80} height={32} className="absolute -top-1.5 left-6 z-20 -rotate-3" />
            <div className="absolute -top-2 -left-2 z-10">
              <StarDoodle size={28} color="#7a9ec4" />
            </div>
            <div className="p-4">
              <h3 className="font-caveat text-xl font-bold text-[#3a3733] mb-3 ml-0.5">Documents</h3>
              <PaperTable>
                <TableToolbar>
                  <TableSearch value={search} onChange={setSearch} placeholder="Filter..." />
                  <div className="flex-1" />
                  <ColumnVisibility
                    columns={['Title', 'Status', 'Date']}
                    visible={visible}
                    onChange={toggleCol}
                  />
                </TableToolbar>
                <TableHeader>
                  <tr>
                    {visible.has('Title') && <PaperTh>Title</PaperTh>}
                    {visible.has('Status') && <PaperTh>Status</PaperTh>}
                    {visible.has('Date') && <PaperTh>Date</PaperTh>}
                  </tr>
                </TableHeader>
                <tbody>
                  {DOCS.slice(0, 3).map((doc, i) => (
                    <TableRow key={doc.id} index={i}>
                      {visible.has('Title') && <TableCell>{doc.title}</TableCell>}
                      {visible.has('Status') && <TableCell><StatusBadge status={doc.status} /></TableCell>}
                      {visible.has('Date') && <TableCell muted>2025-06-{(10 + i).toString().padStart(2, '0')}</TableCell>}
                    </TableRow>
                  ))}
                </tbody>
              </PaperTable>
            </div>
          </Paper>

          <Paper
            className="relative rotate-[0.5deg] hover:rotate-0 transition-transform duration-300 lg:col-span-2"
            shadow="soft"
          >
            <Tape variant="Scribble" color="#c9954f" width={90} height={34} className="absolute -top-1 right-10 z-20 rotate-2" />
            <div className="absolute -top-3 -right-3 z-10">
              <SunDoodle size={34} color="#3a3733" className="opacity-20" />
            </div>
            <div className="p-4">
              <h3 className="font-caveat text-xl font-bold text-[#3a3733] mb-3 ml-0.5">Selectable Catalog</h3>
              {selected.length > 0 && (
                <TableSelection.Toolbar count={selected.length} onClear={() => setSelected([])}>
                  <SketchButton size="sm"><Download size={12} /></SketchButton>
                  <SketchButton size="sm"><Trash2 size={12} /></SketchButton>
                </TableSelection.Toolbar>
              )}
              <PaperTable>
                <TableHeader>
                  <tr>
                    <PaperTh style={{ width: 40 }}>
                      <TableSelection.Checkbox
                        checked={selected.length === DOCS.length}
                        indeterminate={selected.length > 0 && selected.length < DOCS.length}
                        onChange={() =>
                          setSelected(
                            selected.length === DOCS.length ? [] : DOCS.map((d) => d.id),
                          )
                        }
                      />
                    </PaperTh>
                    <PaperTh>Title</PaperTh>
                    <PaperTh>Type</PaperTh>
                    <PaperTh>Status</PaperTh>
                  </tr>
                </TableHeader>
                <tbody>
                  {DOCS.map((doc, i) => (
                    <TableRow key={doc.id} index={i} selected={selected.includes(doc.id)}>
                      <TableCell>
                        <TableSelection.Checkbox
                          checked={selected.includes(doc.id)}
                          onChange={() => toggle(doc.id)}
                        />
                      </TableCell>
                      <TableCell>{doc.title}</TableCell>
                      <TableCell><TypeTag type={doc.type} /></TableCell>
                      <TableCell><StatusBadge status={doc.status} /></TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </PaperTable>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};
