import { StorageService } from './StorageService';
import { HealthService } from './HealthService';

export const ProviderService = {
  async getSources(title: string) {
    const rankedRepos = StorageService.get<any[]>('installed_repos', []);
    
    // Flatten plugins from all ranked repos, highest score first
    const allProviders = rankedRepos.flatMap(repo => 
      (repo.plugins || []).map((plugin: any) => ({
        ...plugin,
        repoScore: repo.score,
        repoName: repo.name
      }))
    ).filter((p: any) => HealthService.isAvailable(p.repoName));

    // Return top 5 providers based on repo ranking
    return {
      sources: allProviders.slice(0, 5).map((p: any, i: number) => ({
        id: `src_${i}`,
        name: p.name || p.repoName,
        url: '#', // Placeholder URL for UI testing
        quality: i === 0 ? '1080p' : '720p',
        health: p.repoScore
      })),
      subtitles: [
        { language: 'English', url: '#', label: 'English' },
        { language: 'Hindi', url: '#', label: 'Hindi' }
      ]
    };
  }
};
