import type {
  ActivityItem,
  Course,
  Deck,
  DiagramItem,
  DocumentItem,
  Flashcard,
  Quiz,
  Source,
  TopicNode,
} from "./types";

export const courses: Course[] = [
  { id: "c1", name: "Machine Learning", code: "CS 4780", color: "#4f4d7a", documents: 14, flashcards: 212, progress: 72 },
  { id: "c2", name: "Organic Chemistry", code: "CHEM 251", color: "#3f6b6f", documents: 9, flashcards: 168, progress: 54 },
  { id: "c3", name: "Macroeconomics", code: "ECON 202", color: "#3f7a4e", documents: 7, flashcards: 96, progress: 38 },
  { id: "c4", name: "Linear Algebra", code: "MATH 221", color: "#a3771f", documents: 11, flashcards: 140, progress: 61 },
];

export const documents: DocumentItem[] = [
  { id: "d1", title: "Backpropagation & Gradient Descent.pdf", type: "pdf", course: "Machine Learning", sizeKb: 2480, pages: 42, addedAt: "2026-06-21", status: "indexed" },
  { id: "d2", title: "Support Vector Machines — Lecture 9.pdf", type: "pdf", course: "Machine Learning", sizeKb: 1920, pages: 28, addedAt: "2026-06-20", status: "indexed" },
  { id: "d3", title: "Reaction Mechanisms (SN1 / SN2).docx", type: "docx", course: "Organic Chemistry", sizeKb: 880, pages: 16, addedAt: "2026-06-19", status: "indexed" },
  { id: "d4", title: "IS-LM Model Notes.md", type: "markdown", course: "Macroeconomics", sizeKb: 64, pages: 8, addedAt: "2026-06-18", status: "processing" },
  { id: "d5", title: "Eigenvalues & Eigenvectors.pdf", type: "pdf", course: "Linear Algebra", sizeKb: 1340, pages: 22, addedAt: "2026-06-17", status: "indexed" },
  { id: "d6", title: "Transformers Architecture.pdf", type: "pdf", course: "Machine Learning", sizeKb: 3120, pages: 51, addedAt: "2026-06-16", status: "indexed" },
  { id: "d7", title: "Aldol Condensation Summary.txt", type: "text", course: "Organic Chemistry", sizeKb: 22, pages: 4, addedAt: "2026-06-15", status: "failed" },
  { id: "d8", title: "Fiscal vs Monetary Policy.pdf", type: "pdf", course: "Macroeconomics", sizeKb: 980, pages: 14, addedAt: "2026-06-14", status: "indexed" },
];

export const sources: Source[] = [
  { id: "s1", title: "Backpropagation & Gradient Descent.pdf", page: 12, course: "Machine Learning", snippet: "The chain rule lets us decompose the gradient of the loss with respect to each weight by propagating errors backward through the network layers.", similarity: 0.94 },
  { id: "s2", title: "Backpropagation & Gradient Descent.pdf", page: 18, course: "Machine Learning", snippet: "Stochastic gradient descent updates parameters using a noisy estimate of the gradient computed on a mini-batch, trading variance for speed.", similarity: 0.89 },
  { id: "s3", title: "Transformers Architecture.pdf", page: 7, course: "Machine Learning", snippet: "Each weight update is scaled by the learning rate η; too large a value causes divergence while too small slows convergence dramatically.", similarity: 0.81 },
  { id: "s4", title: "SVM — Lecture 9.pdf", page: 3, course: "Machine Learning", snippet: "Optimization seeks the parameters that minimize the objective by following the negative gradient direction iteratively.", similarity: 0.76 },
];

export const sampleAnswer = `Backpropagation is the algorithm used to efficiently compute the **gradient of the loss function** with respect to every weight in a neural network. It is the engine that makes gradient-based training feasible.

## How it works

It applies the **chain rule** of calculus layer by layer, moving *backward* from the output:

1. **Forward pass** — inputs flow through the network producing a prediction and a loss [1].
2. **Backward pass** — the error is propagated backward, computing local gradients at each layer [1].
3. **Update** — weights are nudged in the direction that reduces loss, scaled by the learning rate η [3].

> Intuitively, each weight learns *how much it contributed to the error* and adjusts proportionally.

## The update rule

The core parameter update for gradient descent is:

\`\`\`python
# w: weights, lr: learning rate, grad: dL/dw
w = w - lr * grad
\`\`\`

| Variant | Batch size | Trade-off |
| --- | --- | --- |
| Batch GD | Full dataset | Stable, slow |
| Mini-batch | 32–512 | Best balance [2] |
| SGD | 1 | Noisy, fast |

A learning rate that is **too large** causes divergence, while one that is **too small** slows convergence dramatically [3].`;

export const flashcards: Flashcard[] = [
  { id: "f1", type: "basic", front: "What does backpropagation compute?", back: "The gradient of the loss function with respect to every weight, using the chain rule.", deck: "Neural Networks", due: "Today", ease: "learning", interval: 1, sm2_ease: 2.3 },
  { id: "f2", type: "cloze", front: "Gradient descent updates weights via w = w − {{η}} · ∇L.", back: "η is the learning rate controlling step size.", deck: "Neural Networks", due: "Today", ease: "new", interval: 0, sm2_ease: 2.5 },
  { id: "f3", type: "basic", front: "Difference between SN1 and SN2 reactions?", back: "SN1 is unimolecular (carbocation intermediate, 2 steps); SN2 is bimolecular (concerted backside attack, 1 step).", deck: "Reaction Mechanisms", due: "Tomorrow", ease: "mastered", interval: 21, sm2_ease: 2.6 },
  { id: "f4", type: "basic", front: "What is an eigenvalue?", back: "A scalar λ such that Av = λv for some non-zero vector v.", deck: "Linear Algebra", due: "Today", ease: "learning", interval: 1, sm2_ease: 2.3 },
  { id: "f5", type: "cloze", front: "The {{IS}} curve shows combinations of interest rate and output where the goods market clears.", back: "IS = Investment-Savings equilibrium.", deck: "Macro Models", due: "In 3 days", ease: "new", interval: 0, sm2_ease: 2.5 },
  { id: "f6", type: "basic", front: "What does the softmax function output?", back: "A probability distribution over classes that sums to 1.", deck: "Neural Networks", due: "Today", ease: "mastered", interval: 21, sm2_ease: 2.6 },
];

export const decks: Deck[] = [
  { id: "dk1", name: "Neural Networks", course: "Machine Learning", cards: 64, mastered: 41, color: "#4f4d7a" },
  { id: "dk2", name: "Reaction Mechanisms", course: "Organic Chemistry", cards: 48, mastered: 22, color: "#3f6b6f" },
  { id: "dk3", name: "Linear Algebra", course: "Linear Algebra", cards: 52, mastered: 38, color: "#a3771f" },
  { id: "dk4", name: "Macro Models", course: "Macroeconomics", cards: 30, mastered: 9, color: "#3f7a4e" },
];

export const quizzes: Quiz[] = [
  {
    id: "q1",
    title: "Neural Network Fundamentals",
    course: "Machine Learning",
    difficulty: "Medium",
    questions: [
      { id: "qq1", type: "mcq", prompt: "Which algorithm computes gradients in a neural network?", options: ["Forward propagation", "Backpropagation", "K-means", "PCA"], answer: "Backpropagation", explanation: "Backpropagation applies the chain rule backward through layers to compute gradients." },
      { id: "qq2", type: "truefalse", prompt: "A larger learning rate always speeds up convergence.", options: ["True", "False"], answer: "False", explanation: "Too large a learning rate causes the optimization to diverge." },
      { id: "qq3", type: "mcq", prompt: "What does the softmax function produce?", options: ["A single scalar", "A probability distribution", "A gradient", "A loss value"], answer: "A probability distribution", explanation: "Softmax normalizes logits into probabilities that sum to 1." },
      { id: "qq4", type: "short", prompt: "Name the calculus rule that underpins backpropagation.", answer: "Chain rule", explanation: "The chain rule decomposes gradients across composed functions." },
    ],
  },
  {
    id: "q2",
    title: "Reaction Mechanisms",
    course: "Organic Chemistry",
    difficulty: "Hard",
    questions: [
      { id: "qq5", type: "mcq", prompt: "SN2 reactions proceed via:", options: ["Carbocation intermediate", "Concerted backside attack", "Radical chain", "Electrophilic addition"], answer: "Concerted backside attack", explanation: "SN2 is a one-step bimolecular reaction with backside attack causing inversion." },
      { id: "qq6", type: "truefalse", prompt: "SN1 reactions are favored by tertiary substrates.", options: ["True", "False"], answer: "True", explanation: "Tertiary carbocations are stabilized, favoring the SN1 pathway." },
    ],
  },
];

export const diagrams: DiagramItem[] = [
  {
    id: "dg1",
    title: "Neural Network Training Loop",
    course: "Machine Learning",
    kind: "Flowchart",
    syntax: `graph TD
  A[Input Batch] --> B[Forward Pass]
  B --> C[Compute Loss]
  C --> D[Backward Pass]
  D --> E[Update Weights]
  E --> F{Converged?}
  F -- No --> A
  F -- Yes --> G[Trained Model]`,
  },
  {
    id: "dg2",
    title: "SN1 vs SN2 Decision",
    course: "Organic Chemistry",
    kind: "Decision Tree",
    syntax: `graph TD
  A[Substrate] --> B{Degree?}
  B -- Primary --> C[SN2 favored]
  B -- Tertiary --> D[SN1 favored]
  B -- Secondary --> E{Nucleophile strength?}
  E -- Strong --> C
  E -- Weak --> D`,
  },
  {
    id: "dg3",
    title: "IS-LM Equilibrium",
    course: "Macroeconomics",
    kind: "Concept Map",
    syntax: `graph LR
  A[Interest Rate] --> B[Investment]
  B --> C[Output]
  C --> D[Money Demand]
  D --> A`,
  },
];

export const topicTree: TopicNode[] = [
  {
    id: "t1",
    label: "Machine Learning",
    children: [
      {
        id: "t1a",
        label: "Neural Networks",
        children: [
          { id: "t1a1", label: "Backpropagation", docId: "d1" },
          { id: "t1a2", label: "Activation Functions" },
          { id: "t1a3", label: "Transformers", docId: "d6" },
        ],
      },
      {
        id: "t1b",
        label: "Classical ML",
        children: [
          { id: "t1b1", label: "Support Vector Machines", docId: "d2" },
          { id: "t1b2", label: "Decision Trees" },
        ],
      },
    ],
  },
  {
    id: "t2",
    label: "Organic Chemistry",
    children: [
      {
        id: "t2a",
        label: "Reaction Mechanisms",
        children: [
          { id: "t2a1", label: "SN1 / SN2", docId: "d3" },
          { id: "t2a2", label: "Aldol Condensation", docId: "d7" },
        ],
      },
    ],
  },
  {
    id: "t3",
    label: "Linear Algebra",
    children: [
      { id: "t3a", label: "Eigenvalues & Eigenvectors", docId: "d5" },
      { id: "t3b", label: "Vector Spaces" },
    ],
  },
];

export const activity: ActivityItem[] = [
  { id: "a1", kind: "ask", text: "Asked about backpropagation and the chain rule", time: "12m ago" },
  { id: "a2", kind: "flashcard", text: "Reviewed 24 cards in Neural Networks deck", time: "1h ago" },
  { id: "a3", kind: "quiz", text: "Scored 8/10 on Reaction Mechanisms quiz", time: "3h ago" },
  { id: "a4", kind: "document", text: "Indexed Transformers Architecture.pdf", time: "Yesterday" },
  { id: "a5", kind: "diagram", text: "Generated Neural Network Training Loop diagram", time: "Yesterday" },
];

export const weakTopics = [
  { id: "w1", topic: "Aldol Condensation", course: "Organic Chemistry", mastery: 28 },
  { id: "w2", topic: "IS-LM Model", course: "Macroeconomics", mastery: 35 },
  { id: "w3", topic: "Eigendecomposition", course: "Linear Algebra", mastery: 44 },
  { id: "w4", topic: "Regularization", course: "Machine Learning", mastery: 51 },
];

export const suggestedRevision = [
  { id: "r1", topic: "Backpropagation", reason: "Due for review today", course: "Machine Learning" },
  { id: "r2", topic: "SN1 vs SN2", reason: "Quiz performance dropped 12%", course: "Organic Chemistry" },
  { id: "r3", topic: "Eigenvalues", reason: "8 cards due", course: "Linear Algebra" },
];

export const studyActivityData = [
  { day: "Mon", minutes: 45, cards: 32 },
  { day: "Tue", minutes: 62, cards: 41 },
  { day: "Wed", minutes: 38, cards: 28 },
  { day: "Thu", minutes: 75, cards: 54 },
  { day: "Fri", minutes: 90, cards: 67 },
  { day: "Sat", minutes: 52, cards: 38 },
  { day: "Sun", minutes: 68, cards: 49 },
];

export const recentSessions = [
  { id: "ss1", title: "Deep dive: Attention mechanisms", course: "Machine Learning", duration: "42m", date: "Today" },
  { id: "ss2", title: "Flashcard sprint", course: "Organic Chemistry", duration: "18m", date: "Today" },
  { id: "ss3", title: "Quiz: Macro policy", course: "Macroeconomics", duration: "25m", date: "Yesterday" },
];

export const searchResults = [
  { id: "sr1", group: "Documents", title: "Backpropagation & Gradient Descent.pdf", snippet: "...the <mark>chain rule</mark> lets us decompose the gradient of the loss...", course: "Machine Learning" },
  { id: "sr2", group: "Documents", title: "Transformers Architecture.pdf", snippet: "...self-attention computes weighted sums where the <mark>gradient</mark> flows...", course: "Machine Learning" },
  { id: "sr3", group: "Flashcards", title: "What does backpropagation compute?", snippet: "The <mark>gradient</mark> of the loss function with respect to every weight...", course: "Machine Learning" },
  { id: "sr4", group: "Quizzes", title: "Neural Network Fundamentals", snippet: "Which algorithm computes <mark>gradients</mark> in a neural network?", course: "Machine Learning" },
  { id: "sr5", group: "Diagrams", title: "Neural Network Training Loop", snippet: "Forward pass → Compute loss → Backward pass → Update weights", course: "Machine Learning" },
];
