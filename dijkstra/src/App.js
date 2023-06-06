import React, { useState } from 'react';
import './App.css';

const ROWS = 15;
const COLS = 30;

function Node({ row, col, isWall, isStart, isEnd, onMouseDown, onMouseEnter, onMouseUp }) {
  const extraClassName = isEnd ? 'node-end' : isStart ? 'node-start' : isWall ? 'node-wall' : '';
  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
}

function App() {
  const [grid, setGrid] = useState(createGrid());
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [startNode, setStartNode] = useState({ row: 7, col: 5 });
  const [endNode, setEndNode] = useState({ row: 7, col: 25 });

  function createGrid() {
    const grid = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push({ row, col, isStart: false, isEnd: false, isWall: false });
      }
      grid.push(currentRow);
    }
    return grid;
  }

  function toggleWall(row, col) {
    const newGrid = [...grid];
    const node = newGrid[row][col];
    if (node.isStart || node.isEnd) return;
    node.isWall = !node.isWall;
    setGrid(newGrid);
  }

  function handleMouseDown(row, col) {
    setIsMousePressed(true);
    toggleWall(row, col);
  }

  function handleMouseEnter(row, col) {
    if (!isMousePressed) return;
    toggleWall(row, col);
  }

  function handleMouseUp() {
    setIsMousePressed(false);
  }

  function clearBoard() {
    setGrid(createGrid());
  }

  return (
    <div className="App">
      <div className="tab">
        <button onClick={clearBoard}>Clear Board</button>
        <button>Start</button>
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((node) => (
              <Node
                key={`${node.row}-${node.col}`}
                row={node.row}
                col={node.col}
                isWall={node.isWall}
                isStart={node.row === startNode.row && node.col === startNode.col}
                isEnd={node.row === endNode.row && node.col === endNode.col}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
