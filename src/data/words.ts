import { Difficulty } from '../types';

export const EASY_WORDS: string[] = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'any', 'day', 'most', 'us', 'run', 'fast', 'type',
  'code', 'key', 'hand', 'word', 'test', 'mind', 'flow', 'pure', 'gold', 'blue',
  'sky', 'sun', 'moon', 'star', 'road', 'path', 'open', 'door', 'home', 'play',
  'read', 'jump', 'fox', 'dog', 'cat', 'tree', 'wind', 'rain', 'fire', 'dark',
  'game', 'life', 'lead', 'page', 'line', 'text', 'free', 'hold', 'hope', 'step'
];

export const MEDIUM_WORDS: string[] = [
  'keyboard', 'computer', 'developer', 'browser', 'internet', 'software', 'hardware',
  'monitor', 'practice', 'accuracy', 'solution', 'function', 'variable', 'constant',
  'challenge', 'learning', 'standard', 'complete', 'speeding', 'rhythmic', 'movement',
  'progress', 'reaction', 'momentum', 'efficient', 'building', 'creative', 'dynamic',
  'powerful', 'interface', 'structure', 'algorithm', 'system', 'terminal', 'compiler',
  'engineer', 'framework', 'database', 'network', 'protocol', 'security', 'session',
  'platform', 'responsive', 'performance', 'component', 'workflow', 'production',
  'velocity', 'frequency', 'mastery', 'precision', 'navigation', 'experience',
  'knowledge', 'language', 'operation', 'analytics', 'statistic', 'overview',
  'dashboard', 'category', 'highlight', 'execution', 'benchmark', 'mechanism',
  'feedback', 'optimize', 'sequence', 'interval', 'duration', 'difficulty',
  'standard', 'resource', 'strategy', 'instance', 'calculate', 'threshold',
  'realtime', 'viewport', 'adaptive', 'baseline', 'simulate', 'seamless',
  'constant', 'element', 'document', 'selector', 'storage', 'provider',
  'listener', 'template', 'package', 'container', 'modifier', 'dispatch',
  'priority', 'pipeline', 'generate', 'activate', 'flexible', 'reliable'
];

export const HARD_WORDS: string[] = [
  'TypeScript', 'JavaScript', 'React.js', 'PostgreSQL', 'Kubernetes', 'asynchronous',
  'microservices', 'polymorphism', 'encapsulation', 'idempotency', 'cryptography',
  'concurrency', 'serialization', 'synchronization', 'observability', 'instrumentation',
  'counter-intuitive', 'state-of-the-art', 'next-generation', 'ultra-fast', 'well-architected',
  'high-performance', 'zero-latency', 'cross-platform', 'user-friendly', 'object-oriented',
  'event-driven', 'fault-tolerant', 'mission-critical', 'data-intensive', 'end-to-end',
  '120wpm', '99.9%', '#TypeFast', '2026', 'v1.0.4', 'O(n*log(n))', 'API_KEY',
  'deterministic', 'heterogeneous', 'proportional', 'unprecedented', 'quintessential',
  'sophisticated', 'extraordinary', 'comprehensive', 'differentiated', 'multithreaded',
  'uncompromising', 'interoperability', 'reproducibility', 'transformational', 'simultaneously',
  'instantaneous', 'infrastructure', 'configuration', 'telemetry', 'orchestration',
  'bio-feedback', 'ergonomics', 'neuroplasticity', 'finger-dexterity', 'touch-typing',
  'sub-millisecond', 're-evaluating', 'multi-paradigm', 'auto-scaling', 'rate-limiting'
];

/**
 * Returns a randomized array of words suited for typing tests.
 */
export function generateWords(difficulty: Difficulty, count: number = 80): string[] {
  let sourceWords: string[];

  switch (difficulty) {
    case 'easy':
      sourceWords = EASY_WORDS;
      break;
    case 'hard':
      // Hard mode is a rich blend of Hard, Medium, and technical terms
      sourceWords = [...HARD_WORDS, ...MEDIUM_WORDS];
      break;
    case 'medium':
    default:
      // Medium mode blends Medium and Easy words for natural typing cadence
      sourceWords = [...MEDIUM_WORDS, ...EASY_WORDS];
      break;
  }

  const result: string[] = [];
  let prevWord = '';

  for (let i = 0; i < count; i++) {
    // Pick random word avoiding immediate consecutive duplicates
    let randomWord: string;
    do {
      const randomIndex = Math.floor(Math.random() * sourceWords.length);
      randomWord = sourceWords[randomIndex];
    } while (randomWord === prevWord && sourceWords.length > 1);

    result.push(randomWord);
    prevWord = randomWord;
  }

  return result;
}
