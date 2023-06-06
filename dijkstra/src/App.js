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

function createGrid(startPos, endPos) {
  const grid = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < COLS; col++) {
      currentRow.push({ 
        row, 
        col, 
        isStart: row === startPos.row && col === startPos.col, 
        isEnd: row === endPos.row && col === endPos.col, 
        isWall: false, 
        distance: Infinity, 
        isVisited: false, 
        previousNode: null 
      });
    }
    grid.push(currentRow);
  }
  return grid;
}

function App() {
  const [startPos, setStartPos] = useState({ row: 7, col: 5 });
  const [endPos, setEndPos] = useState({ row: 7, col: 25 });
  const [grid, setGrid] = useState(createGrid(startPos, endPos));
  const [isMousePressed, setIsMousePressed] = useState(false);


  

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
    const newGrid = createGrid(startPos, endPos);
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        newGrid[row][col].distance = Infinity;
        newGrid[row][col].isVisited = false;
        newGrid[row][col].previousNode = null;
        const nodeDOM = document.getElementById(`node-${row}-${col}`);
        nodeDOM.className = newGrid[row][col].isStart
          ? 'node node-start'
          : newGrid[row][col].isEnd
          ? 'node node-end'
          : 'node';
      }
    }
    setGrid(newGrid);
  }
  

  function visualizeDijkstra() {
    const visitedNodesInOrder = dijkstra();
    const shortestPath = getShortestPath();
    animateAlgorithm(visitedNodesInOrder, shortestPath);
  }

  function dijkstra() {
    const startNode = grid[startPos.row][startPos.col];
    const endNode = grid[endPos.row][endPos.col];
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes();

    while (unvisitedNodes.length > 0) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();

      if (closestNode.isWall) continue;

      if (closestNode.distance === Infinity) return visitedNodesInOrder;

      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);

      if (closestNode === endNode) {
        return visitedNodesInOrder;
      }

      updateUnvisitedNeighbors(closestNode);
    }
  }

  function sortNodesByDistance(nodes) {
    nodes.sort((a, b) => a.distance - b.distance);
  }

  function getAllNodes() {
    const nodes = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        nodes.push(grid[row][col]);
      }
    }
    return nodes;
  }

  function updateUnvisitedNeighbors(node) {
    const neighbors = getNeighbors(node);
    for (let neighbor of neighbors) {
      const distance = node.distance + 1;
      if (distance < neighbor.distance) {
        neighbor.distance = distance;
        neighbor.previousNode = node;
      }
    }
  }

  function getNeighbors(node) {
    const neighbors = [];
    const { row, col } = node;

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter((neighbor) => !neighbor.isVisited);
  }

  function getShortestPath() {
    const shortestPath = [];
    let currentNode = grid[endPos.row][endPos.col];
    while (currentNode !== null) {
      shortestPath.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return shortestPath;
  }

  function animateAlgorithm(visitedNodesInOrder, shortestPath) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(shortestPath);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, 10 * i);
    }
  }

  function animateShortestPath(shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const node = shortestPath[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
      }, 50 * i);
    }
  }

  return (
    <div className="App">
      <div className="tab">
        <button onClick={clearBoard}>Clear Board</button>
        <button onClick={visualizeDijkstra}>Start</button>
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
                isStart={node.row === startPos.row && node.col === startPos.col}
                isEnd={node.row === endPos.row && node.col === endPos.col}
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
