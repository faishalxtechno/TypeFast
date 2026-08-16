import { AICoachAnalysis, PracticeMode, TestResult } from '../types';
import { getAnalyticsSummary, getAllTests } from './testService';
import { getWeakestKeys } from './weakKeyService';

export function generateAICoachAnalysis(recentTest?: TestResult): AICoachAnalysis {
  const analytics = getAnalyticsSummary();
  const allTests = getAllTests();
  const weakKeys = getWeakestKeys(4).map(k => k.key);

  const weakCombos = weakKeys.length >= 2
    ? [
        `${weakKeys[0]}${weakKeys[1]}`,
        `${weakKeys[1]}${weakKeys[0]}`,
        `${weakKeys[0]}H`,
        `T${weakKeys[0]}`
      ]
    : ['TH', 'ER', 'IN', 'AN'];

  const test = recentTest || allTests[0];

  // 1. Speed Analysis
  let speedAnalysis = 'Maintaining consistent speed pacing across sessions.';
  if (test) {
    if (test.wpm > analytics.averageWpm) {
      const delta = test.wpm - analytics.averageWpm;
      speedAnalysis = `Good velocity — your ${test.wpm} WPM is +${delta} WPM above your historical average (${analytics.averageWpm} WPM).`;
    } else if (test.wpm < analytics.averageWpm) {
      speedAnalysis = `Slightly below your average of ${analytics.averageWpm} WPM. Focus on rhythm and relaxed finger positioning.`;
    } else {
      speedAnalysis = `Solid steady pace matching your ${analytics.averageWpm} WPM baseline.`;
    }
  }

  // 2. Accuracy Analysis
  let accuracyAnalysis = `Your overall accuracy is ${analytics.averageAccuracy.toFixed(1)}%.`;
  if (test) {
    if (test.accuracy < 94) {
      accuracyAnalysis = `Accuracy dropped to ${test.accuracy.toFixed(1)}% (${test.errors} errors). Slowing down by 5% will dramatically compound precision.`;
    } else if (test.accuracy >= 98) {
      accuracyAnalysis = `Elite precision of ${test.accuracy.toFixed(1)}%! You are ready to accelerate your keystroke tempo.`;
    } else {
      accuracyAnalysis = `Clean typing at ${test.accuracy.toFixed(1)}% accuracy. Keep maintaining high error discipline.`;
    }
  }

  // 3. Consistency Analysis
  let consistencyAnalysis = 'Cadence stability is well balanced.';
  if (analytics.consistencyScore < 85) {
    consistencyAnalysis = 'Your typing bursts are uneven: initial keystrokes are significantly faster than later segments.';
  } else {
    consistencyAnalysis = `High rhythm stability (${analytics.consistencyScore.toFixed(0)}% consistency) across sentence transitions.`;
  }

  // 4. Progress Analysis
  const progressAnalysis = `You are improving +${analytics.monthlyImprovementPercent.toFixed(1)}% compared to your previous 30-day baseline.`;

  // 5. Main Weakness Diagnosis
  let mainWeakness = `Key transitions with ${weakKeys.slice(0, 3).join(', ')} cause hesitation.`;
  if (test && test.accuracy < 90) {
    mainWeakness = 'Error recovery: backspacing multi-character errors creates speed stalls.';
  } else if (analytics.averageWpm < 50 && analytics.averageAccuracy > 96) {
    mainWeakness = 'Finger travel distance: hesitation before pressing outer row keys.';
  } else if (test && test.errors > 6) {
    mainWeakness = `High error frequency on ${weakKeys.slice(0, 2).join(' and ')} clusters.`;
  }

  // 6. Recommendation & Recommended Practice Mode
  let recommendation = `Focus on ${weakKeys.join(', ')} combinations for the next 5 minutes.`;
  let recommendedMode: PracticeMode = 'weak-keys';
  let recommendedDuration = 60;

  if (test && test.accuracy < 92) {
    recommendation = 'Focus strictly on 98%+ accuracy without worrying about top speed.';
    recommendedMode = 'accuracy';
  } else if (analytics.averageWpm > 70 && analytics.averageAccuracy >= 97) {
    recommendation = 'Push your speed limits with high-tempo sprint practice.';
    recommendedMode = 'speed';
  } else if (weakKeys.length > 0) {
    recommendation = `Target your difficult keys (${weakKeys.join(', ')}) with repetitive pattern conditioning.`;
    recommendedMode = 'weak-keys';
  } else if (analytics.consistencyScore < 85) {
    recommendation = 'Build cadence endurance with sustained 120-second practice.';
    recommendedMode = 'endurance';
    recommendedDuration = 120;
  }

  return {
    speedAnalysis,
    accuracyAnalysis,
    weakKeys,
    weakCombinations: weakCombos,
    consistencyAnalysis,
    progressAnalysis,
    mainWeakness,
    recommendation,
    recommendedMode,
    recommendedDuration
  };
}
