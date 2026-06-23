export interface ReadingSection {
  id: string;
  number: string;
  title: string;
  paragraphs: string[];
}

export const readingDoc = {
  title: "Deep Learning: Foundations",
  author: "I. Goodfellow, Y. Bengio, A. Courville",
  kind: "Textbook · Chapter 6",
  pages: 42,
  sections: [
    {
      id: "sec1",
      number: "1",
      title: "Introduction",
      paragraphs: [
        "Deep learning is a form of machine learning that enables computers to learn from experience and understand the world in terms of a hierarchy of concepts. Because the computer gathers knowledge from experience, there is no need for a human operator to formally specify all the knowledge the computer needs.",
        "The hierarchy of concepts allows the computer to learn complicated concepts by building them out of simpler ones. If we draw a graph showing how these concepts are built on top of each other, the graph is deep, with many layers. For this reason, we call this approach deep learning.",
      ],
    },
    {
      id: "sec2",
      number: "2",
      title: "Neural Networks",
      paragraphs: [
        "A feedforward neural network defines a mapping y = f(x; θ) and learns the value of the parameters θ that result in the best function approximation. These models are called feedforward because information flows through the function being evaluated from x, through the intermediate computations used to define f, and finally to the output y.",
        "When feedforward neural networks are extended to include feedback connections, they are called recurrent neural networks. The depth of the network gives rise to the terminology used to describe the field.",
      ],
    },
    {
      id: "sec3",
      number: "3",
      title: "Backpropagation",
      paragraphs: [
        "Gradient descent minimizes a differentiable loss function by iteratively moving parameters in the direction of steepest descent. The back-propagation algorithm provides an efficient way to compute the gradient of the loss with respect to every parameter in the network.",
        "Back-propagation refers only to the method for computing the gradient, while another algorithm, such as stochastic gradient descent, is used to perform learning using this gradient. The chain rule of calculus is used to compute the derivatives of functions formed by composing other functions whose derivatives are known.",
      ],
    },
    {
      id: "sec4",
      number: "4",
      title: "Optimization",
      paragraphs: [
        "Optimization for training deep models differs from pure optimization in several ways. Typically the loss function decomposes as a sum over the training examples, and we minimize the expected loss with respect to the data-generating distribution rather than the empirical distribution.",
        "Momentum, adaptive learning rates, and second-order methods are designed to accelerate learning, particularly in the face of high curvature, small but consistent gradients, or noisy gradients.",
      ],
    },
    {
      id: "sec5",
      number: "5",
      title: "Transformers",
      paragraphs: [
        "The Transformer dispenses with recurrence entirely and relies on a self-attention mechanism to draw global dependencies between input and output. This allows for significantly more parallelization and has become the dominant architecture in natural language processing.",
        "Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions, capturing a rich set of relationships within the sequence.",
      ],
    },
  ] as ReadingSection[],
};

export const bookmarks = [
  { id: "bm1", section: "Backpropagation", note: "Exam: chain rule derivation" },
  { id: "bm2", section: "Transformers", note: "Self-attention intuition" },
];

export const highlights = [
  { id: "hl1", text: "Gradient descent minimizes a differentiable loss function.", section: "Backpropagation" },
  { id: "hl2", text: "Multi-head attention allows the model to jointly attend…", section: "Transformers" },
  { id: "hl3", text: "The graph is deep, with many layers.", section: "Introduction" },
];

export const lensExplanations: Record<string, string> = {
  Beginner:
    "Think of gradient descent like walking downhill in fog: you feel which way is steepest down and take a small step that way, over and over, until you reach the bottom (the lowest error).",
  Intermediate:
    "Gradient descent updates parameters in the opposite direction of the loss gradient, scaled by a learning rate. Repeating this moves the model toward a local minimum of the loss surface.",
  Expert:
    "For a differentiable loss L(θ), the update θ ← θ − η∇L(θ) follows the steepest-descent direction. Convergence and stability depend on the learning rate η relative to the curvature (Hessian eigenvalues) of L near the optimum.",
};
