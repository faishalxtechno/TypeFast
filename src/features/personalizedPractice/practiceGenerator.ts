import { PracticeMode } from '../../types';
import { getWeakestKeys } from '../../services/weakKeyService';

const VOCABULARY_BY_KEY: Record<string, string[]> = {
  R: ['great', 'right', 'run', 'practice', 'training', 'record', 'through', 'strong', 'growth', 'real', 'react', 'result', 'program', 'server'],
  T: ['that', 'their', 'time', 'together', 'system', 'structure', 'state', 'target', 'testing', 'thought', 'typing', 'faster', 'action'],
  G: ['great', 'growth', 'going', 'algorithm', 'language', 'program', 'engineering', 'global', 'target', 'digit', 'signal', 'design'],
  H: ['through', 'their', 'thought', 'history', 'ahead', 'higher', 'human', 'health', 'heart', 'change', 'benchmark', 'theme'],
  B: ['build', 'bridge', 'best', 'benchmark', 'number', 'symbol', 'browser', 'database', 'before', 'between', 'backend', 'brand'],
  P: ['practice', 'performance', 'platform', 'speed', 'program', 'prompt', 'precision', 'profile', 'process', 'explore', 'expert'],
  Y: ['typing', 'system', 'daily', 'accuracy', 'keyboard', 'velocity', 'royalty', 'memory', 'every', 'always', 'dynamically', 'layer'],
  C: ['coach', 'certificate', 'character', 'consistency', 'clean', 'code', 'connect', 'cloud', 'complete', 'create', 'accuracy'],
  M: ['mastery', 'memory', 'movement', 'measure', 'modern', 'machine', 'metric', 'moment', 'muscle', 'matrix', 'maximum', 'medium'],
  V: ['velocity', 'verify', 'view', 'navigate', 'level', 'evaluate', 'proven', 'active', 'creative', 'visual', 'every', 'strive'],
  K: ['keyboard', 'keystroke', 'weak', 'streak', 'knowledge', 'track', 'quick', 'make', 'skill', 'rank', 'clock', 'break'],
  W: ['words', 'weak', 'warrior', 'power', 'growth', 'flow', 'world', 'network', 'between', 'hardware', 'swift', 'workflow'],
  F: ['fast', 'feedback', 'focus', 'finger', 'force', 'fluid', 'found', 'effort', 'first', 'interface', 'future', 'profile']
};

export function generatePracticeText(mode: PracticeMode, customKeys?: string[]): { text: string; targetKeys: string[] } {
  const weakKeyList = customKeys || getWeakestKeys(4).map(k => k.key);
  const targetKeys = weakKeyList.length > 0 ? weakKeyList : ['R', 'T', 'G', 'H'];

  if (mode === 'weak-keys') {
    // Gather words for the target weak keys
    const pool: string[] = [];
    targetKeys.forEach(k => {
      if (VOCABULARY_BY_KEY[k]) {
        pool.push(...VOCABULARY_BY_KEY[k]);
      }
    });

    // Shuffle and pick 25 words
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 24);
    if (selected.length < 15) {
      selected.push('great', 'training', 'through', 'practice', 'strong', 'typing', 'growth', 'better', 'future', 'together');
    }
    return {
      text: selected.join(' '),
      targetKeys
    };
  }

  if (mode === 'combinations') {
    const combos = ['great three through together strong training growth target algorithm practice history programming structure react'];
    return {
      text: combos[0],
      targetKeys
    };
  }

  if (mode === 'accuracy') {
    return {
      text: "Precision creates consistency. Clean keystrokes with zero backspacing build muscle memory far faster than rushed typing. Focus on smooth, steady rhythm and flawless accuracy.",
      targetKeys: ['Precision', 'Cadence']
    };
  }

  if (mode === 'speed') {
    return {
      text: "the quick and fast flow of swift words moving across the screen with natural speed and high velocity without hesitation or pause",
      targetKeys: ['Tempo', 'Velocity']
    };
  }

  // Endurance Mode
  return {
    text: "Touch typing is an essential superpower for programmers and writers alike. When your fingers move effortlessly without conscious thought, your brain can focus entirely on problem solving, creative synthesis, and high-level logic. Regular daily practice builds neuromuscular pathways that compound into remarkable velocity over weeks and months.",
    targetKeys: ['Endurance', 'Focus']
  };
}
