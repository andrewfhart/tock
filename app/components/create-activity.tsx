"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Slider } from "~/components/ui/slider";
import { Activity, GoalType } from "~/types/activity";
import { v4 as uuidv4 } from "uuid";

interface CreateActivityProps {
  onSave: (activity: Activity) => void;
  onCancel: () => void;
}

export function CreateActivity({ onSave, onCancel }: CreateActivityProps) {
  const [label, setLabel] = useState("");
  const [timeGoal, setTimeGoal] = useState<number | undefined>(undefined);
  const [goalType, setGoalType] = useState<GoalType>("neutral");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: uuidv4(),
      label,
      timeGoal: timeGoal ? timeGoal * 60 : undefined, // Convert hours to minutes
      goalType: timeGoal ? goalType : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="space-y-2">
        <Label htmlFor="label">Activity Name (Required)</Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Time Goal (Optional)</Label>
        <Slider
          min={0}
          max={24}
          step={0.25}
          value={[timeGoal || 0]}
          onValueChange={(value) => setTimeGoal(value[0] || undefined)}
        />
        <div className="text-sm text-muted-foreground">
          {timeGoal ? `${timeGoal} hours per day` : "No time goal set"}
        </div>
      </div>

      {timeGoal && (
        <div className="space-y-2">
          <Label>Goal Type</Label>
          <RadioGroup
            value={goalType}
            onValueChange={(value: GoalType) => setGoalType(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="more" id="more" />
              <Label htmlFor="more">More is better</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="less" id="less" />
              <Label htmlFor="less">Less is better</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="neutral" id="neutral" />
              <Label htmlFor="neutral">Neutral</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!label}>
          Create
        </Button>
      </div>
    </form>
  );
}
