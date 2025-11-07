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
  
  return (
    <button
      onClick={onClick}
      disabled={isClicked}
      className={cn(
        "w-24 h-24 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg",
        colorMap[displayColor],
        isClicked && "cursor-not-allowed opacity-70"
      )}
    />
  );
};
