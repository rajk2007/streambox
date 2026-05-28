interface ProviderScore { id: string; score: number; failures: number; cooldownUntil: number; }
export const HealthService = {
  scores: new Map<string, ProviderScore>(),
  recordSuccess(id: string) {
    const c = this.scores.get(id) ?? { id, score: 50, failures: 0, cooldownUntil: 0 };
    c.score = Math.min(100, c.score + 2); c.failures = 0;
    this.scores.set(id, c);
  },
  recordFailure(id: string) {
    const c = this.scores.get(id) ?? { id, score: 50, failures: 0, cooldownUntil: 0 };
    c.score = Math.max(0, c.score - 10); c.failures += 1;
    if (c.failures >= 3) c.cooldownUntil = Date.now() + 300000;
    this.scores.set(id, c);
  },
  isAvailable(id: string): boolean {
    const s = this.scores.get(id);
    return s ? Date.now() > s.cooldownUntil : true;
  }
};
