import React, { useEffect, useState } from 'react';
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
  Hash,
  ThumbsDown,
  TriangleAlert,
} from 'lucide-react';
import { toast } from "@/app/lib/toast";
import { api, type TraceData, type TraceAnalytics } from "../lib/api";

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

export const RetrievalTracePanel = () => {
  const [trace, setTrace] = useState<TraceData | null>(null);
  const [selectedChunk, setSelectedChunk] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<TraceAnalytics | null>(null);

  const loadAnalytics = () => {
    api.getTraceAnalytics().then(setAnalytics).catch(() => {});
  };

  const load = () => {
    api
      .getTrace()
      .then((t) => {
        setTrace(t);
        setSelectedChunk(t.chunks[0]?.id ?? null);
      })
      .catch(() => toast.error("Could not load trace"));
    loadAnalytics();
  };

  useEffect(load, []);

  const chunks = trace?.chunks ?? [];
  const selected = chunks.find((c) => c.id === selectedChunk) ?? null;

  const flagChunk = async () => {
    if (!selected) return;
    try {
      await api.sendChunkFeedback(selected.source, selected.id, trace?.query ?? "", selected.similarity);
      toast.success("Chunk flagged as unhelpful");
      loadAnalytics();
    } catch {
      toast.error("Could not record feedback");
    }
  };

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
          <Button variant="outline" size="sm" className="h-8" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
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
              <MetricItem label="Retrieved Chunks" value={trace?.retrievedChunks ?? 0} icon={Box} />
              <MetricItem label="Documents" value={trace?.documents ?? 0} icon={FileText} />
              <MetricItem label="Avg Similarity" value={(trace?.avgSimilarity ?? 0).toFixed(2)} icon={Hash} />
              <MetricItem label="Embedding Model" value={trace?.embeddingModel || "—"} icon={BrainCircuit} />
              <MetricItem label="Vector Store" value={trace?.vectorStore || "LanceDB"} icon={Database} />
              <MetricItem label="Top K" value={trace?.topK ?? 0} icon={Layers} />
            </div>
          </div>

          {/* Bad-chunk analytics */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center">
              <TriangleAlert className="h-4 w-4 mr-2 text-muted-foreground" />
              Low-quality Chunk Analytics
              <Badge variant="outline" className="ml-2 text-xs">{analytics?.totalFlags ?? 0} flags</Badge>
            </h3>
            {analytics && analytics.sources.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Weak</TableHead>
                      <TableHead className="text-right">👎</TableHead>
                      <TableHead className="text-right">Avg Sim</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.sources.map((s) => (
                      <TableRow key={s.source}>
                        <TableCell className="max-w-[180px] truncate" title={s.source}>{s.source}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{s.weakCount}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{s.downCount}</TableCell>
                        <TableCell className="text-right font-mono">{s.avgSimilarity.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No weak generations recorded yet. Chunks retrieved for ungrounded or low-confidence
                answers — plus any you flag below — show up here.
              </p>
            )}
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
                  {chunks.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                        No retrieval yet — ask a question to populate the trace.
                      </TableCell>
                    </TableRow>
                  )}
                  {chunks.map((chunk) => (
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
                {selected && (
                  <Badge variant="outline" className="ml-2 font-mono text-xs bg-muted/50">
                    {selected.id}
                  </Badge>
                )}
              </div>
            </h3>
            <div className="bg-muted/30 border rounded-lg p-4 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap">
              <p>{selected?.text ?? "Select a chunk to preview its retrieved text."}</p>
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
              <Button size="sm" variant="outline" className="flex-1" disabled={!selected} onClick={flagChunk}>
                <ThumbsDown className="h-4 w-4 mr-2" />
                Flag unhelpful
              </Button>
            </div>
          </div>

        </div>
      </ScrollArea>
    </Card>
  );
};

export default RetrievalTracePanel;
