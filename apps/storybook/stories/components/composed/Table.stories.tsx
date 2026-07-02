import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperTable, TableHeader, PaperTh, TableRow, TableCell, Pagination } from '@paper-ui/components/tables'
import { StatusBadge, TypeTag } from '@paper-ui/components/badges'

const meta: Meta<typeof PaperTable> = {
  title: 'Components/Composed/Table',
  component: PaperTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PaperTable>

const docs = [
  { id: 1, title: 'Neural Networks', type: 'pdf', status: 'indexed' as const, size: '2.4 MB' },
  { id: 2, title: 'Math Notes', type: 'md', status: 'processing' as const, size: '48 KB' },
  { id: 3, title: 'Textbook', type: 'pdf', status: 'indexed' as const, size: '5.1 MB' },
]

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<number[]>([])
    const toggle = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

    return (
      <div className="p-8 bg-[#f4f1ea] max-w-3xl">
        <PaperTable striped>
          <TableHeader>
            <tr>
              <PaperTh style={{ width: 40 }}>#</PaperTh>
              <PaperTh>Title</PaperTh>
              <PaperTh>Type</PaperTh>
              <PaperTh>Status</PaperTh>
              <PaperTh className="text-right">Size</PaperTh>
            </tr>
          </TableHeader>
          <tbody>
            {docs.map((doc, i) => (
              <TableRow key={doc.id} index={i} selected={selected.includes(doc.id)} onClick={() => toggle(doc.id)}>
                <TableCell muted>{doc.id}</TableCell>
                <TableCell><span className="font-kalam font-bold">{doc.title}</span></TableCell>
                <TableCell><TypeTag type={doc.type} /></TableCell>
                <TableCell><StatusBadge status={doc.status} /></TableCell>
                <TableCell align="right" muted>{doc.size}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </PaperTable>
        {selected.length > 0 && <p className="mt-2 font-architect text-xs text-ink-muted">Selected: {selected.join(', ')}</p>}
      </div>
    )
  },
}

export const Composed: Story = {
  render: () => {
    const [page, setPage] = useState(1)

    return (
      <div className="p-8 bg-[#f4f1ea] max-w-3xl space-y-6">
        <div>
          <h3 className="font-caveat text-lg text-ink-muted/70 mb-3">Documents</h3>
          <PaperTable>
            <TableHeader>
              <tr>
                <PaperTh>Title</PaperTh>
                <PaperTh>Type</PaperTh>
                <PaperTh className="text-right">Size</PaperTh>
              </tr>
            </TableHeader>
            <tbody>
              {docs.slice(0, 2).map((doc, i) => (
                <TableRow key={doc.id} index={i}>
                  <TableCell><span className="font-kalam font-bold">{doc.title}</span></TableCell>
                  <TableCell><TypeTag type={doc.type} /></TableCell>
                  <TableCell align="right" muted>{doc.size}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </PaperTable>
        </div>
        <div>
          <h3 className="font-caveat text-lg text-ink-muted/70 mb-3">Pagination</h3>
          <Pagination page={page} totalPages={5} onPageChange={setPage} />
        </div>
      </div>
    )
  },
}
