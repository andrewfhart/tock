'use client'

import { useState, useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { getActivityTimes, getStoredActivities } from '~/utils/storage'

export function DebugView({ onClose }: { onClose: () => void }) {
  const [activityTimes, setActivityTimes] = useState<string>('')
  const [activities, setActivities] = useState<string>('')

  useEffect(() => {
    // Format the data for display
    const times = getActivityTimes()
    const activitiesList = getStoredActivities()

    setActivityTimes(JSON.stringify(times, null, 2))
    setActivities(JSON.stringify(activitiesList, null, 2))
  }, [])

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Debug View</h2>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Activities:</h3>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {activities}
            </pre>
          </ScrollArea>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Activity Times:</h3>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {activityTimes}
            </pre>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

