import { useEffect } from "react";

interface TimerProps {
  timeLeft: number;
  onTimeUp: () => void;
}

export const Timer = ({ timeLeft, onTimeUp }: TimerProps) => {
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className="text-right">
      <div className="text-6xl font-bold text-foreground tabular-nums">
        {timeLeft}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider">
        Seconds
      </div>
    </div>
  );
};
