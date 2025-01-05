import { Activity } from '~/types/activity'
import { cn } from '~/lib/utils'

interface ActivityButtonProps {
  activity: Activity
  isActive: boolean
  timeSpent: number
  onClick: () => void
}

export function ActivityButton({ activity, isActive, timeSpent, onClick }: ActivityButtonProps) {
  const progress = activity.timeGoal ? (timeSpent / activity.timeGoal) * 100 : 0
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full p-4 mb-2 text-left rounded-lg border transition-colors",
        isActive ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
      )}
    >
      <span className="font-medium">{activity.label}</span>
      {activity.timeGoal && (
        <div className="absolute bottom-0 left-0 h-1 bg-background/20 rounded-b-lg overflow-hidden w-full">
          <div 
            className={cn(
              "h-full transition-all",
              activity.goalType === 'more' ? "bg-green-500" :
              activity.goalType === 'less' ? "bg-red-500" :
              "bg-blue-500"
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </button>
  )
}

