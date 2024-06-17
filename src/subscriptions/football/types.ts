export interface Match {
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
  match_time: {
    length: number
  }
  status: 'before' | 'live' | 'after'
  stages?: Array<any>
  series?: string
  round?: number
  attendance?: number
  has_videos: boolean
  has_live_scores: true
}
