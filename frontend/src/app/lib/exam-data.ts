export interface ExamQuestion {
  id: string;
  type: "mcq" | "truefalse" | "short" | "long";
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  options?: string[];
  answer?: string;
}

export const examQuestions: ExamQuestion[] = [
  { id: "e1", type: "mcq", topic: "Backpropagation", difficulty: "Medium", prompt: "Which rule of calculus underpins the backpropagation algorithm?", options: ["Product rule", "Chain rule", "Quotient rule", "L'Hôpital's rule"], answer: "Chain rule" },
  { id: "e2", type: "truefalse", topic: "Optimization", difficulty: "Easy", prompt: "A larger learning rate always guarantees faster convergence.", options: ["True", "False"], answer: "False" },
  { id: "e3", type: "mcq", topic: "Transformers", difficulty: "Hard", prompt: "Why is the attention score scaled by √dₖ?", options: ["To normalize the output", "To stabilize gradients for large dimensions", "To reduce computation", "To enforce sparsity"], answer: "To stabilize gradients for large dimensions" },
  { id: "e4", type: "short", topic: "Activation Functions", difficulty: "Medium", prompt: "Name one advantage of ReLU over the sigmoid activation." },
  { id: "e5", type: "long", topic: "Transformers", difficulty: "Hard", prompt: "Explain the purpose of self-attention in Transformer architectures and how it differs from recurrence." },
  { id: "e6", type: "mcq", topic: "Backpropagation", difficulty: "Medium", prompt: "What does backpropagation compute?", options: ["The forward pass", "The loss value", "Gradients of the loss w.r.t. weights", "The learning rate"], answer: "Gradients of the loss w.r.t. weights" },
  { id: "e7", type: "truefalse", topic: "Activation Functions", difficulty: "Easy", prompt: "Softmax outputs a probability distribution that sums to 1.", options: ["True", "False"], answer: "True" },
  { id: "e8", type: "mcq", topic: "Optimization", difficulty: "Medium", prompt: "Which optimizer combines momentum with adaptive per-parameter learning rates?", options: ["SGD", "Adam", "RMSProp", "Adagrad"], answer: "Adam" },
];

export const topicPerformance = [
  { topic: "Transformers", score: 95 },
  { topic: "Backpropagation", score: 82 },
  { topic: "Optimization", score: 61 },
  { topic: "Activation Functions", score: 58 },
];

export const difficultyAnalysis = [
  { level: "Easy", correct: 4, total: 4 },
  { level: "Medium", correct: 3, total: 4 },
  { level: "Hard", correct: 1, total: 3 },
];

export const sourceMaterials = [
  "Machine Learning (CS 4780)",
  "Transformers Architecture.pdf",
  "Backpropagation & Gradient Descent.pdf",
  "Lecture Notes — Optimization",
];

export const formulaSheet = [
  { name: "Weight update", formula: "w ← w − η · ∂L/∂w" },
  { name: "Softmax", formula: "σ(z)ᵢ = e^{zᵢ} / Σⱼ e^{zⱼ}" },
  { name: "Cross-entropy", formula: "L = −Σᵢ yᵢ · log(ŷᵢ)" },
  { name: "Attention", formula: "softmax(QKᵀ / √dₖ) · V" },
];
