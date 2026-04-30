import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_DECREMENT = 2; // Decrease ms per tick

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];

const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);
  
  const directionRef = useRef(INITIAL_DIRECTION);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const generateFoodInfo = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Check collision with snake
      const collision = currentSnake.some(
        segment => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!collision) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFoodInfo(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    if (gameAreaRef.current) {
      gameAreaRef.current.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack keys if user is interacting with UI elements
      if (document.activeElement?.tagName === 'BUTTON' || document.activeElement?.tagName === 'INPUT') {
        if (e.key === ' ') return;
      }

      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) || (e.key === ' ' && document.activeElement?.tagName !== 'BUTTON')) {
        e.preventDefault();
      }

      if (e.key === ' ' && !isGameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || isGameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isPaused]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newDirection = directionRef.current;
        setDirection(newDirection);

        const newHead = {
          x: head.x + newDirection.x,
          y: head.y + newDirection.y
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const nextScore = s + 10;
            if (nextScore > highScore) setHighScore(nextScore);
            return nextScore;
          });
          setFood(generateFoodInfo(newSnake));
          setSpeed(s => Math.max(MIN_SPEED, s - SPEED_DECREMENT));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const timeoutId = setTimeout(moveSnake, speed);
    return () => clearTimeout(timeoutId);
  }, [snake, isGameOver, isPaused, food, highScore, generateFoodInfo, speed]);

  // Click outside area to focus? Let's just listen to window keydowns
  // and manage focus mostly with the main screen, we already attached to window.

  return (
    <div className="flex flex-col items-center">
      {/* Score Header */}
      <div className="flex justify-between w-full max-w-md px-6 py-4 mb-4 bg-neon-panel border border-neon-green/30 rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.1)] backdrop-blur-sm">
        <div className="flex flex-col">
          <span className="text-neon-green/60 text-xs font-bold uppercase tracking-wider">Score</span>
          <span className="text-2xl font-black text-white drop-shadow-[0_0_8px_rgba(57,255,20,0.8)] font-mono">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-neon-blue/60 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3 h-3" />
            <span>High Score</span>
          </div>
          <span className="text-xl font-bold text-white drop-shadow-[0_0_5px_rgba(0,243,255,0.6)] font-mono">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative group">
        <div 
          className="w-[90vw] h-[90vw] max-w-[400px] max-h-[400px] bg-black border-2 border-neon-green shadow-[0_0_20px_rgba(57,255,20,0.3)] rounded-lg relative overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(rgba(57,255,20,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.05) 1px, transparent 1px)',
            backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
          }}
        >
          {/* Food */}
          <div 
            className="absolute bg-neon-pink rounded-full shadow-[0_0_10px_rgba(255,0,255,1)]"
            style={{
              left: `${(food.x / GRID_SIZE) * 100}%`,
              top: `${(food.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              transform: 'scale(0.8)'
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className="absolute bg-neon-green"
                style={{
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                  borderRadius: isHead ? '4px' : '2px',
                  boxShadow: isHead ? '0 0 15px rgba(57,255,20,1)' : '0 0 5px rgba(57,255,20,0.6)',
                  transform: 'scale(0.95)'
                }}
              />
            );
          })}

          {/* Overlays (Game Over / Paused) */}
          {isGameOver && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-all">
              <h2 className="text-4xl font-black text-neon-pink mb-2 drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] tracking-widest text-center uppercase">
                Game Over
              </h2>
              <p className="text-white mb-6 font-mono text-lg font-bold">Score: {score}</p>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-neon-green text-neon-green font-bold rounded-full hover:bg-neon-green hover:text-black transition-all shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.8)]"
              >
                <RefreshCcw className="w-5 h-5" />
                PLAY AGAIN
              </button>
            </div>
          )}

          {!isGameOver && isPaused && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <h2 className="text-4xl font-black text-neon-blue mb-6 drop-shadow-[0_0_15px_rgba(0,243,255,0.8)] tracking-widest text-center uppercase">
                Paused
              </h2>
              <button 
                onClick={() => setIsPaused(false)}
                className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-neon-blue text-neon-blue font-bold rounded-full hover:bg-neon-blue hover:text-black transition-all shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.8)]"
              >
                <Play className="w-5 h-5 fill-current" />
                RESUME
              </button>
            </div>
          )}
        </div>

        {/* Controls Hint */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-mono text-white/50 uppercase tracking-widest">
          <span>Arrows / WASD to Move</span>
          <span className="hidden sm:inline">•</span>
          <span>Space to Pause</span>
        </div>
      </div>
    </div>
  );
}
