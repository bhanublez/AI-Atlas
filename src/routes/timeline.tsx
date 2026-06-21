import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

// -------------------------------------------------------------------
//  Types
// -------------------------------------------------------------------
interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
  people?: string[];
  paper?: string;
  paperUrl?: string; // optional link to the paper
  significance: string;
  impact: string;
  concepts: string[];
}

// -------------------------------------------------------------------
//  Extended & refined dataset (many events added / enhanced)
// -------------------------------------------------------------------
const events: TimelineEvent[] = [
  {
    year: "1943",
    title: "McCulloch & Pitts Neuron",
    desc: "First mathematical model of an artificial neuron, showing that networks of simple binary units could compute any logical function.",
    people: ["Warren McCulloch", "Walter Pitts"],
    paper: "A Logical Calculus of the Ideas Immanent in Nervous Activity",
    significance:
      "Introduced the idea that biological neurons could be represented using mathematical logic.",
    impact:
      "Laid the foundation for neural networks and computational neuroscience.",
    concepts: ["Binary neurons", "Logic gates", "Neural computation"],
  },
  {
    year: "1950",
    title: "Turing Test",
    desc: "Alan Turing proposes an imitation game to determine whether a machine can exhibit intelligent behaviour indistinguishable from a human.",
    people: ["Alan Turing"],
    paper: "Computing Machinery and Intelligence",
    significance:
      "Shifted the AI debate from 'Can machines think?' to measurable behaviour.",
    impact: "Remains one of the most influential philosophical ideas in AI.",
    concepts: ["Imitation game", "Machine intelligence", "AI philosophy"],
  },
  {
    year: "1956",
    title: "Dartmouth Conference",
    desc: "The historic summer workshop where the field of Artificial Intelligence was officially born.",
    people: [
      "John McCarthy",
      "Marvin Minsky",
      "Claude Shannon",
      "Nathan Rochester",
    ],
    significance: "The term 'Artificial Intelligence' was formally coined.",
    impact: "Sparked decades of AI research across academia and industry.",
    concepts: ["Symbolic AI", "Reasoning", "Expert systems"],
  },
  {
    year: "1957",
    title: "Perceptron",
    desc: "Frank Rosenblatt's trainable neural network – the first algorithm that could learn weights from data.",
    people: ["Frank Rosenblatt"],
    significance: "Demonstrated that machines could learn from examples.",
    impact: "Inspired modern supervised learning techniques.",
    concepts: ["Linear classification", "Gradient learning"],
  },
  {
    year: "1966",
    title: "ELIZA",
    desc: "One of the first conversational programs, using simple pattern matching to simulate a Rogerian psychotherapist.",
    people: ["Joseph Weizenbaum"],
    significance:
      "Showed how shallow language tricks can create the illusion of understanding.",
    impact:
      "Established foundations for chatbots and human-computer interaction.",
    concepts: ["NLP", "Pattern matching", "Chatbots"],
  },
  {
    year: "1969",
    title: "Perceptrons Critique",
    desc: "Minsky & Papert mathematically prove the limits of single-layer perceptrons, contributing to the first AI winter.",
    people: ["Marvin Minsky", "Seymour Papert"],
    significance:
      "Highlighted the inability to solve non-linearly separable problems like XOR.",
    impact: "Froze neural network funding for a decade.",
    concepts: ["XOR problem", "AI winter", "Linear separability"],
  },
  {
    year: "1973",
    title: "Lighthill Report",
    desc: "A damning UK government report concluding that AI had failed to deliver on its grandiose promises, triggering an AI winter in Britain.",
    people: ["James Lighthill"],
    significance: "Led to severe cuts in AI research funding in the UK.",
    impact: "Extended the AI winter internationally.",
    concepts: ["AI winter", "Policy impact"],
  },
  {
    year: "1980",
    title: "Expert Systems Boom",
    desc: "Rule-based systems (like MYCIN, XCON) achieve commercial success, reviving interest in AI.",
    significance: "Knowledge engineering became a major industry.",
    impact: "Demonstrated that AI could solve real business problems.",
    concepts: ["MYCIN", "Knowledge bases", "Inference engines"],
  },
  {
    year: "1986",
    title: "Backpropagation",
    desc: "The rediscovery and popularisation of the backpropagation algorithm for training multi-layer neural networks.",
    people: ["David Rumelhart", "Geoffrey Hinton", "Ronald Williams"],
    paper: "Learning Representations by Back-Propagating Errors",
    significance: "Enabled effective training of deep neural networks.",
    impact: "Became the core algorithm behind modern deep learning.",
    concepts: ["Gradient descent", "Chain rule", "Deep learning"],
  },
  {
    year: "1989",
    title: "Convolutional Neural Networks",
    desc: "Yann LeCun applies backpropagation to a convolutional architecture for handwritten digit recognition (LeNet).",
    people: ["Yann LeCun"],
    significance: "Introduced weight sharing and spatial hierarchies.",
    impact: "Established the foundations of computer vision.",
    concepts: ["Convolution", "Pooling", "Feature maps"],
  },
  {
    year: "1995",
    title: "Support Vector Machines",
    desc: "Vapnik & Cortes develop SVMs, a powerful kernel‑based learning method that dominates classification for years.",
    people: ["Vladimir Vapnik", "Corinna Cortes"],
    significance:
      "Offered a theoretically grounded alternative to neural networks.",
    impact: "Became the go‑to classifier until the deep learning revolution.",
    concepts: ["Kernel methods", "Margin maximisation", "SVM"],
  },
  {
    year: "1997",
    title: "LSTM",
    desc: "Long Short‑Term Memory networks solve the vanishing gradient problem in recurrent nets.",
    people: ["Sepp Hochreiter", "Jürgen Schmidhuber"],
    significance: "Enabled learning of long‑range dependencies in sequences.",
    impact: "Dominated speech recognition and NLP for years.",
    concepts: ["RNN", "Memory cells", "Gates"],
  },
  {
    year: "1997",
    title: "Deep Blue Defeats Kasparov",
    desc: "IBM's chess computer defeats world champion Garry Kasparov in a six‑game match.",
    significance: "Marked a milestone for AI in strategic reasoning.",
    impact: "Demonstrated AI's ability to outperform humans in complex games.",
    concepts: ["Search algorithms", "Game theory", "Minimax"],
  },
  {
    year: "2006",
    title: "Deep Learning Revival",
    desc: "Geoffrey Hinton shows that layer‑wise unsupervised pretraining can effectively train deep belief networks.",
    people: ["Geoffrey Hinton"],
    significance: "Addressed training challenges in deep architectures.",
    impact: "Restarted industry and academic interest in deep learning.",
    concepts: ["Autoencoders", "RBMs", "Representation learning"],
  },
  {
    year: "2009",
    title: "ImageNet",
    desc: "Fei‑Fei Li releases a massive labelled image dataset, later fuelling the deep learning revolution.",
    people: ["Fei‑Fei Li"],
    significance: "Provided huge amounts of high‑quality training data.",
    impact: "Accelerated breakthroughs in computer vision.",
    concepts: ["Big data", "Benchmark datasets"],
  },
  {
    year: "2011",
    title: "IBM Watson",
    desc: "Watson defeats Jeopardy! champions, showcasing advanced natural language question answering.",
    significance: "Demonstrated practical, real‑time NLP at scale.",
    impact: "Increased enterprise interest in AI.",
    concepts: ["Question answering", "Knowledge retrieval"],
  },
  {
    year: "2012",
    title: "AlexNet",
    desc: "Deep CNNs dramatically improve ImageNet accuracy, winning the competition by a huge margin.",
    people: ["Alex Krizhevsky", "Ilya Sutskever", "Geoffrey Hinton"],
    significance: "Proved that deep learning scales with data and GPUs.",
    impact: "Triggered the modern deep learning revolution.",
    concepts: ["GPU training", "ReLU", "Dropout"],
  },
  {
    year: "2014",
    title: "Generative Adversarial Networks",
    desc: "Ian Goodfellow introduces GANs – two networks contesting with each other to generate realistic data.",
    people: ["Ian Goodfellow"],
    significance: "Introduced adversarial training.",
    impact: "Revolutionised image generation and data synthesis.",
    concepts: ["Generator", "Discriminator", "Synthetic media"],
  },
  {
    year: "2014",
    title: "Seq2Seq & Neural Machine Translation",
    desc: "Encoder‑decoder architectures with attention open the door to end‑to‑end translation.",
    people: ["Ilya Sutskever", "Oriol Vinyals", "Quoc Le"],
    significance: "First fully neural machine translation system.",
    impact: "Paved the way for modern language models.",
    concepts: ["Encoder‑decoder", "Attention", "NMT"],
  },
  {
    year: "2015",
    title: "ResNet",
    desc: "Residual connections enable training of networks with over 100 layers, winning ImageNet 2015.",
    people: ["Kaiming He"],
    significance: "Solved degradation issues in deep architectures.",
    impact: "Became a standard backbone in vision models.",
    concepts: ["Skip connections", "Residual learning"],
  },
  {
    year: "2016",
    title: "AlphaGo",
    desc: "DeepMind's reinforcement‑learning system defeats world Go champion Lee Sedol.",
    significance: "Combined deep learning with Monte Carlo tree search.",
    impact: "Demonstrated AI mastery in a domain of immense complexity.",
    concepts: [
      "Monte Carlo Tree Search",
      "Reinforcement learning",
      "Policy networks",
    ],
  },
  {
    year: "2017",
    title: "Transformer",
    desc: "The seminal paper 'Attention Is All You Need' introduces self‑attention, replacing recurrence.",
    people: ["Ashish Vaswani", "Noam Shazeer", "Jakob Uszkoreit"],
    paper: "Attention Is All You Need",
    significance: "Enabled highly parallel sequence modelling.",
    impact: "Powers all modern large language models.",
    concepts: ["Self‑attention", "Positional encoding", "Multi‑head attention"],
  },
  {
    year: "2018",
    title: "BERT",
    desc: "Bidirectional Encoder Representations from Transformers set new records across NLP tasks.",
    people: ["Jacob Devlin"],
    significance:
      "Introduced masked language modelling and deep bidirectional context.",
    impact: "Transformed search engines and NLP applications.",
    concepts: ["Masked tokens", "Fine‑tuning"],
  },
  {
    year: "2018",
    title: "GPT",
    desc: "OpenAI's Generative Pretrained Transformer shows that a large generative model can be fine‑tuned for many tasks.",
    people: ["OpenAI"],
    significance:
      "Demonstrated scaling laws for autoregressive language models.",
    impact: "Laid the foundation for modern conversational AI.",
    concepts: ["Autoregression", "Next‑token prediction"],
  },
  {
    year: "2020",
    title: "GPT‑3",
    desc: "A 175‑billion parameter language model with surprising in‑context learning abilities.",
    significance: "Exhibited strong few‑shot learning without fine‑tuning.",
    impact: "Changed how humans interact with AI systems.",
    concepts: ["Few‑shot learning", "Scaling laws", "In‑context learning"],
  },
  {
    year: "2020",
    title: "AlphaFold",
    desc: "DeepMind solves the protein folding problem with high accuracy.",
    people: ["DeepMind"],
    significance:
      "Demonstrated AI's potential to accelerate scientific discovery.",
    impact: "Opened new avenues in biology and medicine.",
    concepts: ["Protein structure", "Attention", "Scientific AI"],
  },
  {
    year: "2021",
    title: "CLIP & DALL·E",
    desc: "Vision‑language alignment enables zero‑shot image classification and text‑to‑image generation.",
    people: ["OpenAI"],
    significance: "Unified image understanding and generation.",
    impact: "Created the modern generative AI ecosystem.",
    concepts: ["Multimodal AI", "Contrastive learning", "Text‑to‑image"],
  },
  {
    year: "2022",
    title: "Stable Diffusion & ChatGPT",
    desc: "Generative AI reaches mainstream users with open‑source image synthesis and a compelling conversational agent.",
    significance: "Democratised image generation and conversational AI.",
    impact: "Sparked global adoption of AI tools.",
    concepts: ["Diffusion models", "RLHF", "Instruction tuning"],
  },
  {
    year: "2023",
    title: "Open LLM Movement",
    desc: "Models like LLaMA, Mistral and Gemma bring competitive performance to open‑source.",
    people: ["Meta", "Mistral", "Google"],
    significance: "High‑quality models become accessible to everyone.",
    impact: "Accelerated innovation across research and startups.",
    concepts: ["Llama", "Mistral", "Gemma", "Open source"],
  },
  {
    year: "2024+",
    title: "Multimodal AI & Agents",
    desc: "Models gain native vision, audio, tool use, and long‑horizon reasoning capabilities.",
    significance: "AI systems evolve from chatbots to autonomous assistants.",
    impact: "Transforms productivity, software engineering and robotics.",
    concepts: [
      "Tool calling",
      "Computer use",
      "Agentic workflows",
      "Reasoning models",
    ],
  },
];

// -------------------------------------------------------------------
//  Route definition (unchanged, just with enhanced component)
// -------------------------------------------------------------------
export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "AI Timeline — AI Knowledge Atlas" },
      {
        name: "description",
        content:
          "A visual timeline of artificial intelligence — from the perceptron to frontier LLMs.",
      },
      { property: "og:title", content: "AI Timeline" },
      {
        property: "og:description",
        content: "The history of AI in one scroll.",
      },
    ],
  }),
  component: TimelinePage,
});

// -------------------------------------------------------------------
//  Sub‑component for a single timeline card
// -------------------------------------------------------------------
function EventCard({ event, index }: { event: TimelineEvent; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className={`relative flex sm:items-center ${
        isEven ? "sm:flex-row" : "sm:flex-row-reverse"
      }`}
    >
      {/* Dummy spacer for alignment */}
      <div className="hidden flex-1 sm:block" />

      {/* Timeline dot */}
      <div className="absolute left-4 z-10 grid h-3 w-3 -translate-x-1/2 place-items-center sm:left-1/2">
        <div className="h-3 w-3 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-300 shadow-[0_0_20px_rgba(99,102,241,0.8)]" />
      </div>

      {/* Card container */}
      <div
        className={`ml-12 flex-1 sm:ml-0 ${
          isEven ? "sm:pl-12" : "sm:pr-12 sm:text-right"
        }`}
      >
        <div className="font-mono text-xs text-cyan-300">{event.year}</div>

        <div className="glass gradient-border mt-1 rounded-xl p-5 transition-shadow duration-300 hover:shadow-xl hover:shadow-indigo-500/20">
          <h3 className="font-display text-lg font-semibold">{event.title}</h3>

          <p className="mt-2 text-sm text-muted-foreground">{event.desc}</p>

          {event.people?.length ? (
            <div className="mt-3">
              <span className="text-xs font-semibold text-cyan-300">
                Researchers:
              </span>
              <p className="mt-1 text-sm">{event.people.join(", ")}</p>
            </div>
          ) : null}

          {event.paper ? (
            <div className="mt-3">
              <span className="text-xs font-semibold text-cyan-300">
                Key Paper:
              </span>
              {event.paperUrl ? (
                <a
                  href={event.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm italic text-cyan-200 underline underline-offset-2 hover:text-cyan-100"
                >
                  {event.paper}
                </a>
              ) : (
                <p className="mt-1 text-sm italic">{event.paper}</p>
              )}
            </div>
          ) : null}

          {event.significance ? (
            <div className="mt-3">
              <span className="text-xs font-semibold text-cyan-300">
                Why It Matters:
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                {event.significance}
              </p>
            </div>
          ) : null}

          {event.impact ? (
            <div className="mt-3">
              <span className="text-xs font-semibold text-cyan-300">
                Impact:
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                {event.impact}
              </p>
            </div>
          ) : null}

          {event.concepts?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {event.concepts.map((concept) => (
                <span
                  key={concept}
                  className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-200"
                >
                  {concept}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------------
//  Main page component
// -------------------------------------------------------------------
function TimelinePage() {
  const [search, setSearch] = useState("");

  const filteredEvents = useMemo(() => {
    if (!search.trim()) return events;
    const q = search.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.desc.toLowerCase().includes(q) ||
        e.year.includes(q) ||
        (e.people && e.people.join(" ").toLowerCase().includes(q)) ||
        (e.paper && e.paper.toLowerCase().includes(q)) ||
        e.concepts.some((c) => c.toLowerCase().includes(q)),
    );
  }, [search]);

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
          History
        </div>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          AI <span className="gradient-text">Timeline</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Eighty years of AI in one scroll. Search, explore, and understand the
          milestones that shaped artificial intelligence.
        </p>

        {/* Search input */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search events, researchers, concepts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-sm text-white placeholder-cyan-300/50 backdrop-blur-sm transition focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          />
          {search && (
            <p className="mt-2 text-xs text-cyan-300">
              Showing {filteredEvents.length} of {events.length} events
            </p>
          )}
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative mt-14">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/60 via-cyan-400/40 to-transparent sm:left-1/2" />

        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <EventCard
                  key={`${event.year}-${event.title}`}
                  event={event}
                  index={index}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center text-muted-foreground"
              >
                No events match your search.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
