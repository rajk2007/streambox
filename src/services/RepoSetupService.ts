import { StorageService } from './StorageService';

const PRIORITY_REPOS = [
  { name: 'MegaRepo', url: 'https://raw.githubusercontent.com/self-similarity/MegaRepo/builds/repo.json', shortcode: 'megarepo' },
  { name: 'CloudStream Providers', url: 'https://raw.githubusercontent.com/recloudstream/extensions/master/repo.json', shortcode: 'cspr' },
  { name: 'Phisher Repo', url: 'https://raw.githubusercontent.com/phisher98/cloudstream-extensions-phisher/refs/heads/builds/repo.json', shortcode: 'phisherrepo' },
  { name: 'Megix Repo', url: 'https://raw.githubusercontent.com/SaurabhKaperwan/CSX/builds/CS.json', shortcode: 'csx' },
];

export const RepoSetupService = {
  async initializeApp() {
    // Always fetch priority repos silently on launch
    await this.fetchReposInBatches(PRIORITY_REPOS, true);

    const isInitialized = StorageService.get<boolean>('repos_initialized', false);
    if (!isInitialized) {
      console.log('🚀 First launch: Starting MegaRepo Cascade...');
      await this.executeMegaRepoCascade();
      StorageService.set('repos_initialized', true);
    } else {
      this.updateSecondaryRepos();
    }
  },

  async executeMegaRepoCascade() {
    try {
      const response = await fetch(PRIORITY_REPOS[0].url);
      const megaRepoData = await response.json();
      // The MegaRepo JSON usually contains an array of plugins, which sometimes reference other repos. 
      // We attempt to extract URLs. If this structure fails, we fallback gracefully.
      const allRepoUrls = megaRepoData.plugins?.map((p: any) => p.url).filter(Boolean) || [];
      const secondaryRepos = allRepoUrls.filter((url: string) => !PRIORITY_REPOS.some(pr => pr.url === url));
      await this.fetchReposInBatches(secondaryRepos.map((url: string) => ({ url })), false);
    } catch (error) {
      console.error('MegaRepo Cascade failed, relying on priority repos:', error);
    }
  },

  async fetchReposInBatches(repos: Array<{ name?: string; url: string; shortcode?: string }>, isPriority: boolean) {
    const batchSize = isPriority ? 4 : 10;
    for (let i = 0; i < repos.length; i += batchSize) {
      const batch = repos.slice(i, i + batchSize);
      const results = await Promise.allSettled(batch.map(repo => this.fetchAndRankRepo(repo)));
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) this.saveRepoData(result.value);
      });
    }
  },

  async fetchAndRankRepo(repo: { url: string }): Promise<any | null> {
    const startTime = Date.now();
    try {
      const res = await fetch(repo.url);
      const loadTime = Date.now() - startTime;
      const data = await res.json();
      const pluginCount = data.plugins?.length || 0;
      const speedScore = loadTime < 1000 ? 100 : loadTime < 3000 ? 75 : 50;
      const volumeScore = pluginCount > 20 ? 100 : pluginCount > 10 ? 75 : 50;
      const overallScore = (speedScore * 0.4) + (volumeScore * 0.6);
      return { url: repo.url, name: data.name || 'Unknown', pluginCount, loadTime, score: overallScore, plugins: data.plugins || [] };
    } catch { return null; }
  },

  saveRepoData(repoData: any) {
    const currentRepos = StorageService.get<any[]>('installed_repos', []);
    const existsIndex = currentRepos.findIndex(r => r.url === repoData.url);
    if (existsIndex > -1) currentRepos[existsIndex] = repoData;
    else currentRepos.push(repoData);
    currentRepos.sort((a, b) => b.score - a.score); // Auto-rank by score
    StorageService.set('installed_repos', currentRepos);
  },

  updateSecondaryRepos() {
    const currentRepos = StorageService.get<any[]>('installed_repos', []);
    const nonPriority = currentRepos.filter(r => !PRIORITY_REPOS.some(pr => pr.url === r.url));
    this.fetchReposInBatches(nonPriority.map(r => ({ url: r.url })), false);
  }
};
