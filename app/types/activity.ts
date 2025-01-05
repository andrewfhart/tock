export type GoalType = 'more' | 'less' | 'neutral'

export interface Activity {
  id: string
  label: string
  timeGoal?: number // in minutes
  goalType?: GoalType
}

export interface ActivityTime {
  activityId: string
  startTime: number
  endTime?: number
}

export interface DailyActivities {
  [date: string]: ActivityTime[]
}

