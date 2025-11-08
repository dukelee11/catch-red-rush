import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface GameCircleProps {
  color: string;
  isClicked: boolean;
  onClick: () => void;
}

const colorMap: Record<string, string> = {
  red: "bg-game-red",
  blue: "bg-game-blue",
  green: "bg-game-green",
  yellow: "bg-game-yellow",
  orange: "bg-game-orange",
  purple: "bg-game-purple",
  gray: "bg-game-gray",
};

export const GameCircle = ({ color, isClicked, onClick }: GameCircleProps) => {
  const displayColor = isClicked && color === "red" ? "gray" : color;

  // small guard so we don't call the handler twice (pointerup -> click)
  const justActivatedRef = useRef(false);

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isClicked) return;
    // mark that we triggered via pointer so the subsequent native onClick handler can ignore it
    justActivatedRef.current = true;
    onClick();
    // clear flag after short window
    window.setTimeout(() => {
      justActivatedRef.current = false;
    }, 150);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // if we already handled this via pointerup, ignore the native click
    if (justActivatedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (!isClicked) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onPointerUp={handlePointerUp}
      // pointerdown left alone — avoid preventing focus/usability; pointerup triggers action
      disabled={isClicked}
      className={cn(
        "game-circle w-24 h-24 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg",
        colorMap[displayColor],
        isClicked && "cursor-not-allowed opacity-70"
      )}
    />
  );
};