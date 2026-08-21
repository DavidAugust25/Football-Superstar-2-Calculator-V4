import { Injectable } from '@angular/core';
import { Club, ClubDataset, League } from './club-dataset.service';

export interface EvaluatedClub {
  name: string;
  avgReputation: number;
  teamRepWithUser: number;
  playPercent: number;
  xpScore: number;
}

// A club cannot sign the player when its top-16 + manager average reputation is
// this far (or more) below the player's reputation.
const OUTGROW_THRESHOLD = 6;

const COUNTRY_KEY_TO_CODE: Record<string, string> = {
  austria: 'AUT',
  belgium: 'BEL',
  croatia: 'CRO',
  cyprus: 'CYP',
  czech: 'CZE',
  denmark: 'DEN',
  england: 'ENG',
  france: 'FRA',
  germany: 'GER',
  greece: 'GRE',
  hungary: 'HUN',
  ireland: 'IRL',
  italy: 'ITA',
  netherlands: 'NED',
  northern_ireland: 'NIR',
  norway: 'NOR',
  poland: 'POL',
  portugal: 'POR',
  romania: 'ROU',
  russia: 'RUS',
  scotland: 'SCO',
  serbia: 'SRB',
  spain: 'ESP',
  sweden: 'SWE',
  switzerland: 'SWI',
  turkey: 'TUR',
  ukraine: 'UKR',
};

@Injectable({
  providedIn: 'root',
})
export class ClubEvaluationService {
  evaluate(
    dataset: ClubDataset,
    role: string,
    userRep: number,
    countryKey: string,
    leagueName: string
  ): EvaluatedClub[] {
    const code = COUNTRY_KEY_TO_CODE[countryKey];
    const country = dataset.countries.find((c) => c.code === code);
    if (!country) {
      return [];
    }

    const league = country.leagues.find(
      (l) => this.norm(l.name) === this.norm(leagueName)
    );
    if (!league) {
      return [];
    }

    const sumOpponentBonus = league.clubs.reduce((sum, c) => sum + c.opponentBonus, 0);
    const results: EvaluatedClub[] = [];

    for (const club of league.clubs) {
      const avgReputation = this.teamRep(club);
      if (userRep - avgReputation >= OUTGROW_THRESHOLD) {
        continue;
      }

      // Club teamRep including the user if he cracks the top 16.
      const myRep = this.teamRep(club, userRep);

      const sameRole = club.players
        .filter((p) => p.position === role)
        .sort((a, b) => b.reputation - a.reputation);
      const betterCount = sameRole.filter((p) => p.reputation > userRep).length;

      const pct = this.playPercent(
        role,
        userRep,
        myRep,
        betterCount,
        sameRole,
        club,
        league
      );
      if (pct <= 0.1) {
        continue;
      }

      const xpScore =
        league.gamesPerSeason *
        pct *
        league.competitionBonus *
        (sumOpponentBonus - club.opponentBonus);

      results.push({
        name: club.name,
        avgReputation,
        teamRepWithUser: myRep,
        playPercent: pct,
        xpScore,
      });
    }

    results.sort((a, b) => b.xpScore - a.xpScore);

    // Among clubs where the user plays 100%, sort by teamRep (top16 + manager, including
    // the user) instead of XP-Score, keeping their global XP positions otherwise intact.
    const fullPlayClubs = results.filter((r) => r.playPercent >= 1);
    fullPlayClubs.sort((a, b) => b.teamRepWithUser - a.teamRepWithUser);
    let fullIdx = 0;
    return results.map((r) =>
      r.playPercent >= 1 ? fullPlayClubs[fullIdx++] : r
    );
  }

  private playPercent(
    role: string,
    userRep: number,
    myRep: number,
    betterCount: number,
    sameRole: Club['players'],
    club: Club,
    league: League
  ): number {
    switch (role) {
      case 'AT':
      case 'MC':
      case 'DC':
        if (betterCount <= 1) {
          return 1;
        }
        if (betterCount === 2) {
          const secondBestRep = sameRole[1]?.reputation ?? 0;
          let pct = 0;
          for (const opp of league.clubs) {
            const diff = myRep - this.teamRep(opp);
            const { p433, p532 } = this.formationProbs(diff);
            if (role === 'MC') {
              pct += p433 + p532;
            } else if (role === 'AT') {
              pct += p433;
            } else {
              pct += p532;
            }
          }
          pct /= Math.max(1, league.clubs.length);
          if (userRep >= secondBestRep - 1) {
            pct = (pct + 1) / 2;
          }
          return pct;
        }
        return 0;

      case 'DL':
      case 'DR':
        if (betterCount === 0) {
          return 1;
        }
        if (betterCount === 1) {
          const wideRole = role === 'DL' ? 'ML' : 'MR';
          const clubHasWide = club.players.some((p) => p.position === wideRole);
          if (clubHasWide) {
            return 0;
          }
          const bestRep = sameRole[0]?.reputation ?? 0;
          let pct = 0;
          for (const opp of league.clubs) {
            const diff = myRep - this.teamRep(opp);
            pct += this.formationProbs(diff).p442;
          }
          pct /= Math.max(1, league.clubs.length);
          if (userRep >= bestRep - 1) {
            pct = (pct + 1) / 2;
          }
          return pct;
        }
        return 0;

      case 'ML':
      case 'MR':
        if (betterCount === 0) {
          let pct = 0;
          for (const opp of league.clubs) {
            const diff = myRep - this.teamRep(opp);
            let p442 = this.formationProbs(diff).p442;
            if (userRep > myRep) {
              if (diff > 0) {
                p442 = 0.6 + 0.4 * p442;
              } else if (diff < 0) {
                p442 = 0.3 + 0.7 * p442;
              }
            }
            pct += p442;
          }
          return pct / Math.max(1, league.clubs.length);
        }
        return 0;

      default:
        return 0;
    }
  }

  private formationProbs(diff: number): { p442: number; p433: number; p532: number } {
    const p433 = diff >= 0 ? this.clamp01((diff - 4) / 4) : 0;
    const p532 = diff < 0 ? this.clamp01((-diff - 4) / 4) : 0;
    const p442 = 1 - p433 - p532;
    return { p442, p433, p532 };
  }

  private clamp01(v: number): number {
    return Math.max(0, Math.min(1, v));
  }

  private teamRep(club: Club, includeUserRep?: number): number {
    const reps = club.players.map((p) => p.reputation);
    if (includeUserRep !== undefined) {
      reps.push(includeUserRep);
    }
    reps.sort((a, b) => b - a);
    const top16 = reps.slice(0, 16);
    if (club.manager) {
      top16.push(club.manager.reputation);
    }
    if (top16.length === 0) {
      return 0;
    }
    return top16.reduce((a, b) => a + b, 0) / top16.length;
  }

  private norm(s: string): string {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
}
