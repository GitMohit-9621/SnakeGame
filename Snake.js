import React, { useState, useEffect, useRef } from 'react';
import './Snake.css';

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 }); // Initial direction to move right
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const boardSize = 20;
  const intervalRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction]);

  useEffect(() => {
    if (gameRunning && !gameOver) {
      intervalRef.current = setInterval(() => {
        setSnake((prevSnake) => {
          const newSnake = [...prevSnake];
          const head = newSnake[0];
          const newHead = { x: head.x + direction.x, y: head.y + direction.y };

          // Check for collisions
          if (
            newHead.x < 0 ||
            newHead.x >= boardSize ||
            newHead.y < 0 ||
            newHead.y >= boardSize ||
            newSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)
          ) {
            setGameOver(true);
            setGameRunning(false);
            clearInterval(intervalRef.current);
            return prevSnake;
          }

          newSnake.unshift(newHead);

          // Check if food is eaten
          if (newHead.x === food.x && newHead.y === food.y) {
            setFood({ x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) });
          } else {
            newSnake.pop();
          }

          return newSnake;
        });
      }, 200);

      return () => clearInterval(intervalRef.current);
    }
  }, [direction, food, gameRunning, gameOver]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 1, y: 0 }); // Initial direction to move right
    setGameOver(false);
    setGameRunning(true);
  };

  const stopGame = () => {
    setGameRunning(false);
    clearInterval(intervalRef.current);
  };

  return (
    <div className="snake-game">
      <div className="controls">
        <button onClick={startGame} disabled={gameRunning}>Start</button>
        <button onClick={stopGame} disabled={!gameRunning}>Stop</button>
      </div>
      <div className="board">
        {snake.map((segment, index) => (
          <div key={index} className="snake-segment" style={{ top: `${segment.y * 5}%`, left: `${segment.x * 5}%` }}></div>
        ))}
        <div className="food" style={{ top: `${food.y * 5}%`, left: `${food.x * 5}%` }}></div>
      </div>
      {gameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default SnakeGame;
