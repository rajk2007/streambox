export type ContentType = "movie" | "series" | "anime";
export type Language = "hindi" | "english" | "japanese" | "bengali";

export interface MediaItem {
  id: string;
  title: string;
  type: ContentType;
  year: number;
  rating: number;
  genre: string[];
  language: Language;
  duration?: string;
  seasons?: number;
  episodes?: number;
  description: string;
  poster: string;
  backdrop: string;
  wideCard: string;
  isTrending?: boolean;
  isNew?: boolean;
  isTopRated?: boolean;
  progress?: number;
}

const img = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const make = (
  id: string,
  title: string,
  type: ContentType,
  year: number,
  rating: number,
  genre: string[],
  language: Language,
  description: string,
  extras: Partial<MediaItem> = {},
): MediaItem => ({
  id,
  title,
  type,
  year,
  rating,
  genre,
  language,
  description,
  poster: img(id, 300, 450),
  backdrop: img(id + "b", 800, 450),
  wideCard: img(id + "w", 600, 340),
  ...(type === "movie" ? { duration: extras.duration ?? "2h 15m" } : { seasons: extras.seasons ?? 2, episodes: extras.episodes ?? 16 }),
  ...extras,
});

export const mockData: MediaItem[] = [
  // Anime
  make("onepiece", "One Piece", "anime", 1999, 9.1, ["Action", "Adventure"], "japanese", "A young pirate sets sail to find the legendary One Piece treasure.", { seasons: 20, episodes: 1080, isTopRated: true, isTrending: true }),
  make("naruto", "Naruto Shippuden", "anime", 2007, 8.7, ["Action", "Shounen"], "japanese", "Naruto returns after years of training to face new threats.", { seasons: 21, episodes: 500, progress: 0.6 }),
  make("aot", "Attack on Titan", "anime", 2013, 9.0, ["Action", "Dark Fantasy"], "japanese", "Humanity fights for survival against man-eating titans.", { seasons: 4, episodes: 88, isTopRated: true }),
  make("ds", "Demon Slayer", "anime", 2019, 8.7, ["Action", "Supernatural"], "japanese", "A boy becomes a demon slayer to save his sister.", { seasons: 4, episodes: 55, isTrending: true, isNew: true }),
  make("jjk", "Jujutsu Kaisen", "anime", 2020, 8.6, ["Action", "Supernatural"], "japanese", "Sorcerers battle cursed spirits to protect humanity.", { seasons: 2, episodes: 47, isTrending: true, progress: 0.3 }),
  make("dbz", "Dragon Ball Z", "anime", 1989, 8.8, ["Action", "Adventure"], "japanese", "Goku and friends defend Earth from cosmic threats.", { seasons: 9, episodes: 291 }),
  make("dn", "Death Note", "anime", 2006, 9.0, ["Thriller", "Psychological"], "japanese", "A student finds a notebook that kills anyone whose name is written in it.", { seasons: 1, episodes: 37, isTopRated: true }),
  make("bleach", "Bleach", "anime", 2004, 8.2, ["Action", "Supernatural"], "japanese", "A teen gains soul reaper powers and battles hollows.", { seasons: 16, episodes: 366 }),
  make("opm", "One Punch Man", "anime", 2015, 8.7, ["Action", "Comedy"], "japanese", "A hero so strong he ends every fight with a single punch.", { seasons: 2, episodes: 24, progress: 0.8 }),
  make("fmab", "Fullmetal Alchemist Brotherhood", "anime", 2009, 9.1, ["Adventure", "Drama"], "japanese", "Two brothers seek the philosopher's stone to restore their bodies.", { seasons: 1, episodes: 64, isTopRated: true }),

  // Hindi Movies
  make("dhurandhar", "Dhurandhar", "movie", 2025, 8.4, ["Action", "Thriller"], "hindi", "An undercover operative dives into a high-stakes mission.", { duration: "2h 28m", isNew: true, isTrending: true }),
  make("pushpa2", "Pushpa 2", "movie", 2024, 8.2, ["Action", "Crime"], "hindi", "The rise of a red sandalwood smuggler continues.", { duration: "3h 0m", isTrending: true, isNew: true }),
  make("animal", "Animal", "movie", 2023, 7.5, ["Crime", "Drama"], "hindi", "A son's love for his father turns violent and obsessive.", { duration: "3h 24m" }),
  make("jawan", "Jawan", "movie", 2023, 7.8, ["Action", "Thriller"], "hindi", "A vigilante leads a band of women to right wrongs.", { duration: "2h 49m", progress: 0.5 }),
  make("pathaan", "Pathaan", "movie", 2023, 7.4, ["Action", "Spy"], "hindi", "An exiled agent races to stop a deadly conspiracy.", { duration: "2h 26m" }),
  make("stree2", "Stree 2", "movie", 2024, 7.9, ["Horror", "Comedy"], "hindi", "The town faces a new headless monster preying on women.", { duration: "2h 29m", isTrending: true }),
  make("war2", "War 2", "movie", 2025, 7.6, ["Action", "Spy"], "hindi", "Two agents collide in a globe-trotting war of allegiance.", { duration: "2h 35m", isNew: true }),
  make("dunki", "Dunki", "movie", 2023, 7.0, ["Comedy", "Drama"], "hindi", "Four friends attempt an illegal route to England.", { duration: "2h 41m" }),
  make("tiger3", "Tiger 3", "movie", 2023, 7.1, ["Action", "Spy"], "hindi", "Tiger and Zoya are framed and must clear their names.", { duration: "2h 36m" }),
  make("rocky", "Rocky Aur Rani", "movie", 2023, 7.3, ["Romance", "Drama"], "hindi", "Two opposites swap families to test their love.", { duration: "2h 48m" }),

  // Hindi Series
  make("mirzapur", "Mirzapur", "series", 2018, 8.5, ["Crime", "Drama"], "hindi", "Power, guns and politics rule the underbelly of Mirzapur.", { seasons: 3, episodes: 29, isTopRated: true, progress: 0.7 }),
  make("scam1992", "Scam 1992", "series", 2020, 9.3, ["Biographical", "Drama"], "hindi", "The rise and fall of stockbroker Harshad Mehta.", { seasons: 1, episodes: 10, isTopRated: true }),
  make("panchayat", "Panchayat", "series", 2020, 8.9, ["Comedy", "Drama"], "hindi", "A city graduate takes a job as a village panchayat secretary.", { seasons: 3, episodes: 24, isTopRated: true }),
  make("delhicrime", "Delhi Crime", "series", 2019, 8.5, ["Crime", "Drama"], "hindi", "Investigators race to solve a horrific case in Delhi.", { seasons: 2, episodes: 12 }),
  make("aspirants", "Aspirants", "series", 2021, 9.0, ["Drama", "Slice of Life"], "hindi", "UPSC aspirants chase dreams and friendship in Old Rajinder Nagar.", { seasons: 2, episodes: 10 }),

  // English Movies
  make("inception", "Inception", "movie", 2010, 8.8, ["Sci-Fi", "Action"], "english", "A thief who steals through dreams gets one last shot at redemption.", { duration: "2h 28m", isTopRated: true }),
  make("interstellar", "Interstellar", "movie", 2014, 8.7, ["Sci-Fi", "Drama"], "english", "A team travels through a wormhole in search of a new home.", { duration: "2h 49m", isTopRated: true, progress: 0.2 }),
  make("tdk", "The Dark Knight", "movie", 2008, 9.0, ["Action", "Crime"], "english", "Batman faces his greatest test against the anarchic Joker.", { duration: "2h 32m", isTopRated: true }),
  make("endgame", "Avengers Endgame", "movie", 2019, 8.4, ["Action", "Sci-Fi"], "english", "The Avengers assemble one last time to undo Thanos's snap.", { duration: "3h 1m", isTrending: true }),
  make("dune", "Dune", "movie", 2021, 8.0, ["Sci-Fi", "Adventure"], "english", "A noble heir is thrust into a war over a desert planet's spice.", { duration: "2h 35m" }),
  make("oppen", "Oppenheimer", "movie", 2023, 8.3, ["Biographical", "Drama"], "english", "The story of the man behind the atomic bomb.", { duration: "3h 0m", isNew: true, isTopRated: true }),
  make("jw4", "John Wick 4", "movie", 2023, 7.7, ["Action", "Thriller"], "english", "John Wick takes on the High Table in a final showdown.", { duration: "2h 49m" }),

  // English Series
  make("bb", "Breaking Bad", "series", 2008, 9.5, ["Crime", "Drama"], "english", "A chemistry teacher turns to cooking meth to secure his family.", { seasons: 5, episodes: 62, isTopRated: true }),
  make("moneyheist", "Money Heist", "series", 2017, 8.2, ["Crime", "Thriller"], "english", "A criminal mastermind plans the biggest heist in history.", { seasons: 5, episodes: 41, isTrending: true }),
  make("squid", "Squid Game", "series", 2021, 8.0, ["Thriller", "Drama"], "english", "Cash-strapped players join deadly children's games.", { seasons: 2, episodes: 16, isTrending: true, isNew: true }),
  make("dark", "Dark", "series", 2017, 8.7, ["Sci-Fi", "Mystery"], "english", "Four families unravel a time travel conspiracy.", { seasons: 3, episodes: 26, isTopRated: true }),
  make("peaky", "Peaky Blinders", "series", 2013, 8.8, ["Crime", "Drama"], "english", "A gangster family rises in post-WWI Birmingham.", { seasons: 6, episodes: 36, isTopRated: true, progress: 0.4 }),
  make("tlou", "The Last of Us", "series", 2023, 8.7, ["Drama", "Horror"], "english", "A smuggler escorts a teen across a post-apocalyptic America.", { seasons: 2, episodes: 16, isNew: true }),

  // Bengali
  make("feluda", "Feluda", "series", 2023, 8.1, ["Mystery", "Detective"], "bengali", "Bengal's iconic detective tackles classic cases.", { seasons: 2, episodes: 12 }),
  make("byomkesh", "Byomkesh", "series", 2014, 8.0, ["Mystery", "Period"], "bengali", "The truth-seeker takes on the toughest cases of Calcutta.", { seasons: 3, episodes: 18 }),
  make("kakababu", "Kakababu", "movie", 2022, 7.4, ["Adventure", "Mystery"], "bengali", "An ageless adventurer chases a new global mystery.", { duration: "2h 18m" }),
];

export const getById = (id: string) => mockData.find((m) => m.id === id);

export const continueWatching = mockData.filter((m) => typeof m.progress === "number");
export const trending = mockData.filter((m) => m.isTrending);
export const newReleases = mockData.filter((m) => m.isNew);
export const topRated = [...mockData].filter((m) => m.isTopRated).sort((a, b) => b.rating - a.rating);
export const popularMovies = mockData.filter((m) => m.type === "movie").slice(0, 10);
export const popularSeries = mockData.filter((m) => m.type === "series").slice(0, 8);
export const animePicks = mockData.filter((m) => m.type === "anime").slice(0, 10);
export const regionalHits = mockData.filter((m) => m.language === "hindi" || m.language === "bengali").slice(0, 10);

export const genres = ["Action", "Drama", "Thriller", "Comedy", "Sci-Fi", "Crime", "Adventure", "Romance", "Horror", "Mystery"];
