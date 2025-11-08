import { GameCircle } from "./GameCircle";

interface Circle {
  id: number;
  color: string;
  isClicked: boolean;
}

interface GameGridProps {
  circles: Circle[];
  onCircleClick: (id: number) => void;
}

export const GameGrid = ({ circles, onCircleClick }: GameGridProps) => {
  return (
    <div className="game-grid grid grid-cols-4 gap-8 max-w-2xl mx-auto">
      {circles.map((circle) => (
        <GameCircle
          key={circle.id}
          color={circle.color}
          isClicked={circle.isClicked}
          onClick={() => onCircleClick(circle.id)}
        />
      ))}
    </div>
  );
};
