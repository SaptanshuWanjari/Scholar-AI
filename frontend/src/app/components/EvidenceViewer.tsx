import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText as FileTextIcon, 
  MessageSquare as MessageSquareIcon, 
  StickyNote as StickyNoteIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  ExternalLink as ExternalLinkIcon,
  Eye as EyeIcon,
  Copy as CopyIcon,
  BookOpen as BookOpenIcon,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

interface Chunk {
  id: string;
  text: string;
  highlights: string[];
}

interface Source {
  id: string;
  sourceName: string;
  documentType: 'Document' | 'Note' | 'Answer';
  pageNumber?: number;
  sectionName?: string;
  similarityScore: number; // 0 to 100
  evidenceScore: 'Strong' | 'Moderate' | 'Weak';
  chunks: Chunk[];
}

const mockSources: Source[] = [
  {
    id: '1',
    sourceName: 'Neural Networks and Deep Learning.pdf',
    documentType: 'Document',
    pageNumber: 142,
    sectionName: 'Backpropagation Algorithm',
    similarityScore: 94,
    evidenceScore: 'Strong',
    chunks: [
      {
        id: 'c1',
        text: 'The backpropagation algorithm calculates the gradient of the error function with respect to the neural network\'s weights. It does this by applying the chain rule for derivatives iteratively from the final layer to the initial layer.',
        highlights: ['calculates the gradient of the error function', 'applying the chain rule for derivatives']
      }
    ]
  },
  {
    id: '2',
    sourceName: 'Lecture Notes - Week 5',
    documentType: 'Note',
    sectionName: 'Optimization Techniques',
    similarityScore: 82,
    evidenceScore: 'Moderate',
    chunks: [
      {
        id: 'c2',
        text: 'While backpropagation gives us the gradient, we still need an optimization algorithm like SGD or Adam to actually update the weights and minimize the loss.',
        highlights: ['optimization algorithm like SGD or Adam']
      }
    ]
  },
  {
    id: '3',
    sourceName: 'Q: How does gradient descent work?',
    documentType: 'Answer',
    similarityScore: 65,
    evidenceScore: 'Weak',
    chunks: [
      {
        id: 'c3',
        text: 'Gradient descent steps in the opposite direction of the gradient to find the local minimum. Learning rate controls the step size.',
        highlights: ['opposite direction of the gradient']
      }
    ]
  }
];

const EvidenceViewer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Document': return <FileTextIcon className="w-4 h-4" />;
      case 'Note': return <StickyNoteIcon className="w-4 h-4" />;
      case 'Answer': return <MessageSquareIcon className="w-4 h-4" />;
      default: return <FileTextIcon className="w-4 h-4" />;
    }
  };

  const getEvidenceColor = (score: string) => {
    switch(score) {
      case 'Strong': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Moderate': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Weak': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getEvidenceIcon = (score: string) => {
    switch(score) {
      case 'Strong': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'Moderate': return <AlertCircle className="w-3.5 h-3.5" />;
      case 'Weak': return <AlertCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const highlightText = (text: string, highlights: string[]) => {
    let result = text;
    // Simple replacement for demo purposes. In production, use a more robust parsing approach.
    highlights.forEach(h => {
      const regex = new RegExp(`(${h})`, 'gi');
      result = result.replace(regex, '<span class="bg-indigo-500/20 text-indigo-200 font-medium px-1 rounded-sm">$1</span>');
    });
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6 border border-slate-800 rounded-xl bg-slate-950/50 backdrop-blur-xl overflow-hidden font-sans">
      
      {/* Header Toggle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-900/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              Source Evidence
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">
                {mockSources.length} Sources
              </span>
            </span>
            <span className="text-xs text-slate-500 mt-0.5">
              Verified against knowledge base
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1.5"><FileTextIcon className="w-3.5 h-3.5"/> 4 Docs</div>
            <div className="flex items-center gap-1.5"><StickyNoteIcon className="w-3.5 h-3.5"/> 2 Notes</div>
            <div className="flex items-center gap-1.5"><MessageSquareIcon className="w-3.5 h-3.5"/> 3 Answers</div>
          </div>
          <div className="p-1.5 rounded-full group-hover:bg-slate-800 transition-colors text-slate-400">
            {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-slate-800"
          >
            <div className="p-4 space-y-4 bg-slate-950">
              {mockSources.map((source) => (
                <div key={source.id} className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/40">
                  
                  {/* Source Card Header */}
                  <div className="p-3 border-b border-slate-800/60 bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-slate-800 text-slate-300">
                        {getTypeIcon(source.documentType)}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-200 line-clamp-1" title={source.sourceName}>
                          {source.sourceName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                          <span className="text-slate-300 font-medium">{source.documentType}</span>
                          {source.pageNumber && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-700" />
                              <span>Page {source.pageNumber}</span>
                            </>
                          )}
                          {source.sectionName && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-700" />
                              <span className="truncate max-w-[150px]">{source.sectionName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end gap-1">
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getEvidenceColor(source.evidenceScore)}`}>
                          {getEvidenceIcon(source.evidenceScore)}
                          {source.evidenceScore}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {source.similarityScore}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chunks */}
                  <div className="p-4 space-y-3">
                    {source.chunks.map(chunk => (
                      <div key={chunk.id} className="relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-700 group-hover:bg-indigo-500 transition-colors rounded-full" />
                        <div className="pl-4 text-sm leading-relaxed text-slate-300">
                          <p className="before:content-['\201C'] after:content-['\201D'] text-slate-300">
                            {highlightText(chunk.text, chunk.highlights)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions Footer */}
                  <div className="px-4 py-2.5 bg-slate-900/50 border-t border-slate-800/60 flex items-center justify-end gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors">
                      <ExternalLinkIcon className="w-3.5 h-3.5" />
                      Open
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors">
                      <EyeIcon className="w-3.5 h-3.5" />
                      Context
                    </button>
                    <button 
                      onClick={() => handleCopy(`Citation: ${source.sourceName}, ${source.pageNumber ? 'p. ' + source.pageNumber : ''}`, source.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                    >
                      {copiedId === source.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <CopyIcon className="w-3.5 h-3.5" />}
                      {copiedId === source.id ? 'Copied' : 'Cite'}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded transition-colors ml-2">
                      <BookOpenIcon className="w-3.5 h-3.5" />
                      Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EvidenceViewer;
