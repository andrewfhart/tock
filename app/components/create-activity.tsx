"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Slider } from "~/components/ui/slider";
import { Activity, GoalType } from "~/types/activity";
import { v4 as uuidv4 } from "uuid";

interface CreateActivityFormProps {
  initialValues?: Activity;
  onSubmit: (activity: Activity) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function CreateActivityForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Create",
}: CreateActivityFormProps) {
  const [formData, setFormData] = useState<Omit<Activity, "id">>({
    label: initialValues?.label || "",
    timeGoal: initialValues?.timeGoal ? initialValues.timeGoal / 60 : undefined,
    goalType: initialValues?.goalType || "neutral",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: uuidv4(),
      label: formData.label,
      timeGoal: formData.timeGoal ? formData.timeGoal * 60 : undefined,
      goalType: formData.timeGoal ? formData.goalType : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="space-y-2">
        <Label htmlFor="label">Activity Name (Required)</Label>
        <Input
          id="label"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Time Goal (Optional)</Label>
        <Slider
          min={0}
          max={24}
          step={0.25}
          value={[formData.timeGoal ?? 0]}
          onValueChange={(value) =>
            setFormData({ ...formData, timeGoal: value[0] || undefined })
          }
        />
        <div className="text-sm text-muted-foreground">
          {formData.timeGoal !== undefined
            ? `${formData.timeGoal} hours per day`
            : "No time goal set"}
        </div>
      </div>

      {formData.timeGoal && (
        <div className="space-y-2">
          <Label>Goal Type</Label>
          <RadioGroup
            value={formData.goalType}
            onValueChange={(value: GoalType) =>
              setFormData({ ...formData, goalType: value })
            }
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
        <Button type="submit" className="" disabled={!formData.label}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
