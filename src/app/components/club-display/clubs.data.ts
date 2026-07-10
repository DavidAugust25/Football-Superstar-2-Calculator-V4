export class Club {
  constructor(
    public name: string,
    public averageRating: number,
    public quality: number,
    public availability: boolean
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
    new Club('Red Bull Salzburg', 80, 85, true),
    new Club('Sturm Graz', 76, 78, true),
    new Club('LASK', 74, 72, true),
    new Club('Rapid Wien', 73, 70, false),
  ],
  'austria:2. Liga': [
    new Club('Ried', 68, 60, true),
    new Club('Liefering', 67, 58, true),
    new Club('Grazer AK', 69, 62, true),
    new Club('Admira Wacker', 66, 54, false),
  ],
  'germany:Bundesliga': [
    new Club('Bayern Munich', 88, 98, true),
    new Club('Borussia Dortmund', 84, 88, true),
    new Club('Bayer Leverkusen', 85, 90, true),
    new Club('RB Leipzig', 82, 85, true),
    new Club('Stuttgart', 80, 80, false),
  ],
  'germany:2. Bundesliga': [
    new Club('Hamburg', 74, 75, true),
    new Club('Schalke 04', 72, 70, true),
    new Club('Hertha Berlin', 73, 72, true),
    new Club('FC Köln', 75, 78, false),
  ],
  'england:Premier League': [
    new Club('Liverpool', 89, 97, true),
    new Club('Newcastle United', 84, 86, true),
    new Club('Sunderland', 75, 72, true),
    new Club('Manchester City', 90, 99, false),
    new Club('Arsenal', 88, 95, true),
  ],
  'england:Championship': [
    new Club('Leeds United', 76, 78, true),
    new Club('Leicester City', 77, 80, true),
    new Club('Southampton', 76, 77, true),
    new Club('Ipswich Town', 74, 72, false),
  ],
  'france:Ligue 1': [
    new Club('PSG', 88, 96, true),
    new Club('Marseille', 81, 82, true),
    new Club('Lyon', 80, 78, true),
    new Club('Monaco', 82, 84, false),
  ],
  'france:Ligue 2': [
    new Club('Auxerre', 73, 70, true),
    new Club('Saint-Étienne', 72, 68, true),
    new Club('Bordeaux', 74, 72, true),
    new Club('Angers', 71, 65, false),
  ],
  'croatia:NHS': [
    new Club('Dinamo Zagreb', 78, 80, true),
    new Club('Hajduk Split', 75, 74, true),
    new Club('Rijeka', 73, 70, true),
    new Club('Osijek', 71, 66, false),
  ],
  'croatia:Prva': [
    new Club('Vukovar 1991', 65, 55, true),
    new Club('Zrinski Jurjevac', 64, 52, true),
    new Club('Šibenik', 66, 58, true),
    new Club('Orijent', 61, 45, false),
  ],
};
