export class Club {
  constructor(
    public name: string,
    public averageRating: number,
    public quality: number
  ) {}
}

export interface DisplayRow {
  quality: string;
  name: string;
  avg: string;
  isPlaceholder: boolean;
}

export const CLUBS_BY_COUNTRY_LEAGUE: Record<string, Club[]> = {
  'austria:Bundesliga': [
    new Club('Red Bull Salzburg', 80, 85),
    new Club('Sturm Graz', 76, 78),
    new Club('LASK', 74, 72),
    new Club('Rapid Wien', 73, 70),
  ],
  'austria:2. Liga': [
    new Club('Ried', 68, 60),
    new Club('Liefering', 67, 58),
    new Club('Grazer AK', 69, 62),
    new Club('Admira Wacker', 66, 54),
  ],
  'germany:Bundesliga': [
    new Club('Bayern Munich', 88, 98),
    new Club('Borussia Dortmund', 84, 88),
    new Club('Bayer Leverkusen', 85, 90),
    new Club('RB Leipzig', 82, 85),
    new Club('Stuttgart', 80, 80),
  ],
  'germany:2. Bundesliga': [
    new Club('Hamburg', 74, 75),
    new Club('Schalke 04', 72, 70),
    new Club('Hertha Berlin', 73, 72),
    new Club('FC Köln', 75, 78),
  ],
  'england:Premier League': [
    new Club('Liverpool', 89, 97),
    new Club('Newcastle United', 84, 86),
    new Club('Sunderland', 75, 72),
    new Club('Manchester City', 90, 99),
    new Club('Arsenal', 88, 95),
  ],
  'england:Championship': [
    new Club('Leeds United', 76, 78),
    new Club('Leicester City', 77, 80),
    new Club('Southampton', 76, 77),
    new Club('Ipswich Town', 74, 72),
  ],
  'france:Ligue 1': [
    new Club('PSG', 88, 96),
    new Club('Marseille', 81, 82),
    new Club('Lyon', 80, 78),
    new Club('Monaco', 82, 84),
  ],
  'france:Ligue 2': [
    new Club('Auxerre', 73, 70),
    new Club('Saint-Étienne', 72, 68),
    new Club('Bordeaux', 74, 72),
    new Club('Angers', 71, 65),
  ],
  'croatia:SuperSport HNL': [
    new Club('Dinamo Zagreb', 78, 80),
    new Club('Hajduk Split', 75, 74),
    new Club('Rijeka', 73, 70),
    new Club('Osijek', 71, 66),
  ],
  'croatia:Prva Nogometna Liga': [
    new Club('Vukovar 1991', 65, 55),
    new Club('Zrinski Jurjevac', 64, 52),
    new Club('Šibenik', 66, 58),
    new Club('Orijent', 61, 45),
  ],
  'scotland:League Two': [
    new Club('Forfar Athletic', 7.3, 45)
    new Club('Edinburg City', 7, 41)
  ]
};
