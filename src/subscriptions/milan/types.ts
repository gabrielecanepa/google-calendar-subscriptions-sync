export enum FootballCompetition {
  CL = 'UEFA Champions League',
  EL = 'UEFA Europa League',
  COP = 'Coppa Italia',
  SA = 'Serie A',
}

export interface ForzaFootballMatch {
  id: number
  kickoff_at: string
  home_team: {
    national: boolean
    name: string
    main_color?: Array<number>
    id: number
  }
  away_team: {
    national: boolean
    name: string
    main_color?: Array<number>
    id: number
  }
  score: {
    current?: Array<number>
    first_half?: Array<number>
    second_half?: Array<number>
    extra_time?: Array<number>
    penalty_shootout?: Array<number>
    aggregate?: Array<number>
  }
  tournament: {
    name: string
  }
  stages?: Array<any>
  series?: string
  round?: number
  attendance?: number
  has_videos: boolean
  has_live_scores: true
}
