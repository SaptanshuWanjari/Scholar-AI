import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  ArrowDown,
  Database,
  FileText,
  Search,
  Layers,
  ArrowRight,
  Eye,
  GitCompare,
  RefreshCw,
  ExternalLink,
  BrainCircuit,
  Box,
  Hash
} from 'lucide-react';
import { toast } from "sonner";

interface MetricProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
}

const MetricItem = ({ label, value, icon: Icon }: MetricProps) => (
  <div className="flex flex-col bg-muted/50 p-3 rounded-lg border border-border/50">
    <div className="flex items-center space-x-2 text-muted-foreground mb-1">
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-lg font-semibold">{value}</span>
  </div>
);

const FlowStep = ({ title, icon: Icon, isLast = false }: { title: string, icon: React.ElementType, isLast?: boolean }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary border border-primary/20">
      <Icon className="h-5 w-5" />
    </div>
    <span className="text-xs font-medium mt-2 text-center">{title}</span>
    {!isLast && (
      <div className="h-6 w-px bg-border my-1" />
    )}
  </div>
);

const MOCK_CHUNKS = [
  { id: 'chk_18a9f', source: 'Attention_Is_All.pdf', similarity: 0.92, tokens: 256, page: 4 },
  { id: 'chk_9b2e1', source: 'Attention_Is_All.pdf', similarity: 0.89, tokens: 128, page: 5 },
  { id: 'chk_4f7c2', source: 'Transformer_Architecture.pdf', similarity: 0.85, tokens: 312, page: 12 },
  { id: 'chk_7d3a8', source: 'Neural_Machine_Translation.pdf', similarity: 0.81, tokens: 184, page: 2 },
];

export const RetrievalTracePanel = () => {
  const [selectedChunk, setSelectedChunk] = useState(MOCK_CHUNKS[0].id);

  return (
    <Card className="w-full h-full flex flex-col rounded-none border-0 shadow-none bg-background">
      <CardHeader className="border-b pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center space-x-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <span>Retrieval Trace</span>
            </CardTitle>
            <CardDescription className="mt-1">
              Internal RAG execution metrics and flow
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8" onClick={() => toast.success("Re-running trace")}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-run
          </Button>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          
          {/* Metrics Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center">
              <Database className="h-4 w-4 mr-2 text-muted-foreground" />
              System Metrics
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <MetricItem label="Retrieved Chunks" value="23" icon={Box} />
              <MetricItem label="Documents" value="4" icon={FileText} />
              <MetricItem label="Avg Similarity" value="0.87" icon={Hash} />
              <MetricItem label="Embedding Model" value="nomic-embed-text" icon={BrainCircuit} />
              <MetricItem label="Vector Store" value="Qdrant" icon={Database} />
              <MetricItem label="Last Indexed" value="2 hours ago" icon={RefreshCw} />
            </div>
          </div>

          {/* Retrieval Flow */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center">
              <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
              Execution Pipeline
            </h3>
            <div className="bg-muted/30 border rounded-lg p-4 flex flex-wrap justify-between items-start">
              <FlowStep title="Query" icon={Search} />
              <FlowStep title="Embedding" icon={BrainCircuit} />
              <FlowStep title="Vector Search" icon={Database} />
              <FlowStep title="Top K" icon={Box} />
              <FlowStep title="Reranking" icon={Layers} />
              <FlowStep title="Context" icon={FileText} isLast={true} />
            </div>
          </div>

          {/* Chunks Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center">
              <Box className="h-4 w-4 mr-2 text-muted-foreground" />
              Top Retrieved Chunks
            </h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chunk ID</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Sim</TableHead>
                    <TableHead className="text-right">Tokens</TableHead>
                    <TableHead className="text-right">Page</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_CHUNKS.map((chunk) => (
                    <TableRow 
                      key={chunk.id}
                      className={`cursor-pointer transition-colors ${selectedChunk === chunk.id ? 'bg-muted/50' : ''}`}
                      onClick={() => setSelectedChunk(chunk.id)}
                    >
                      <TableCell className="font-mono text-xs">{chunk.id}</TableCell>
                      <TableCell className="max-w-[150px] truncate" title={chunk.source}>
                        {chunk.source}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={chunk.similarity > 0.9 ? "default" : "secondary"} className="font-mono">
                          {chunk.similarity.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{chunk.tokens}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{chunk.page}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Chunk Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                Chunk Preview
                <Badge variant="outline" className="ml-2 font-mono text-xs bg-muted/50">
                  {selectedChunk}
                </Badge>
              </div>
            </h3>
            <div className="bg-muted/30 border rounded-lg p-4 font-mono text-sm leading-relaxed overflow-x-auto">
              <p>
                The <span className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-1 rounded">attention mechanism</span> allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this.
                Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => toast.success("Chunk opened")}>
                <Box className="h-4 w-4 mr-2" />
                Open Chunk
              </Button>
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => toast.success("Source viewed")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Source
              </Button>
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => toast.success("Comparing chunk")}>
                <GitCompare className="h-4 w-4 mr-2" />
                Compare
              </Button>
            </div>
          </div>

        </div>
      </ScrollArea>
    </Card>
  );
};

export default RetrievalTracePanel;
