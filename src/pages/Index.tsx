import { useState, useEffect, useCallback } from "react";
import { GameGrid } from "@/components/GameGrid";
import { Timer } from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Circle {
  id: number;
  color: string;
  isClicked: boolean;
}

const ROUND_TIMES = [10, 7, 5, 4, 3, 2, 1];
const COLORS = ["blue", "green", "yellow", "orange", "purple"];

const generateCircles = (): Circle[] => {
  const circles: Circle[] = [];
  
  // Add 5 red circles
  for (let i = 0; i < 5; i++) {
    circles.push({ id: i, color: "red", isClicked: false });
  }
  
  // Add 7 other colored circles
  for (let i = 5; i < 12; i++) {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    circles.push({ id: i, color: randomColor, isClicked: false });
  }
  
  // Shuffle the array
  return circles.sort(() => Math.random() - 0.5);
};

const Index = () => {
  const [circles, setCircles] = useState<Circle[]>(generateCircles());
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIMES[0]);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost" | "waiting">("waiting");
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    setCircles(generateCircles());
    setCurrentRound(0);
    setTimeLeft(ROUND_TIMES[0]);
    setGameState("playing");
  }, []);

  const startNextRound = useCallback(() => {
    const nextRound = currentRound + 1;
    if (nextRound >= ROUND_TIMES.length) {
      setGameState("won");
      toast.success("🎉 You Won! Perfect reaction time!");
      return;
    }
    
    setCircles(generateCircles());
    setCurrentRound(nextRound);
    setTimeLeft(ROUND_TIMES[nextRound]);
    toast.success(`Round ${nextRound + 1}! ${ROUND_TIMES[nextRound]} seconds`);
  }, [currentRound]);

  const handleTimeUp = useCallback(() => {
    setGameState("lost");
    toast.error("Time's up! Try again!");
  }, []);

  const handleCircleClick = useCallback((id: number) => {
    if (gameState !== "playing") return;

    const circle = circles.find(c => c.id === id);
    if (!circle || circle.isClicked) return;

    if (circle.color === "red") {
      const newCircles = circles.map(c =>
        c.id === id ? { ...c, isClicked: true } : c
      );
      setCircles(newCircles);

      // Check if all red circles are clicked
      const allRedClicked = newCircles
        .filter(c => c.color === "red")
        .every(c => c.isClicked);

      if (allRedClicked) {
        startNextRound();
      }
    } else {
      setGameState("lost");
      toast.error("Wrong color! You clicked a non-red circle!");
    }
  }, [circles, gameState, startNextRound]);

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    } else if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [gameState, timeLeft]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <header className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-5xl font-bold text-primary mb-2">Catch Red</h1>
            <p className="text-muted-foreground">
              {gameState === "waiting" && "Click all red circles before time runs out!"}
              {gameState === "playing" && `Round ${currentRound + 1} of ${ROUND_TIMES.length}`}
              {gameState === "won" && "You conquered all rounds!"}
              {gameState === "lost" && "Game Over"}
            </p>
          </div>
          {gameState === "playing" && (
            <Timer timeLeft={timeLeft} onTimeUp={handleTimeUp} />
          )}
        </header>

        {gameState === "waiting" && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <p className="text-xl text-foreground">Ready for the challenge?</p>
              <p className="text-muted-foreground">
                You'll have {ROUND_TIMES.join(", ")} seconds across 7 rounds
              </p>
            </div>
            <Button 
              onClick={startGame}
              size="lg"
              className="text-xl px-12 py-6 bg-primary hover:bg-primary/90"
            >
              Start Game
            </Button>
          </div>
        )}

        {gameState === "playing" && (
          <GameGrid circles={circles} onCircleClick={handleCircleClick} />
        )}

        {(gameState === "won" || gameState === "lost") && (
          <div className="text-center space-y-8">
            <div className="text-8xl mb-4">
              {gameState === "won" ? "🏆" : "😔"}
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold">
                {gameState === "won" ? "Victory!" : "Game Over"}
              </h2>
              <p className="text-xl text-muted-foreground">
                {gameState === "won" 
                  ? "You completed all 7 rounds!"
                  : `You reached round ${currentRound + 1} of ${ROUND_TIMES.length}`
                }
              </p>
            </div>
            <Button 
              onClick={startGame}
              size="lg"
              className="text-xl px-12 py-6 bg-primary hover:bg-primary/90"
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
