import { useEffect, useRef, useState } from "react";
import { SimpleCanvas } from "../scripts/CanvasHelper.js";
import Maze from "../scripts/Maze.js";
import CanvasRenderer from "../scripts/Renderer.js";
import { distance, interpolate, lerp } from "../scripts/Utility.js";
import "../styles/CanvasSection.css";
import { useOnDraw } from "./Hooks.js";

function CanvasSection(props) {
	const { generated, clearCanvasProps } = props;
	const [clearCanvas, onClearCanvas] = clearCanvasProps;

	const [maze, setMaze] = useState(new Maze());
	const [renderer, setRenderer] = useState(new CanvasRenderer(maze));

	const { onMouseDown, onMouseMove, setCanvasRef } = useOnDraw(handleDraw);
	const windowResizeListenerRef = useRef(null);
	const canvasRef = useRef(null);

	//effect sets up resize listener and initializes cellPositions
	useEffect(() => {
		const windowResizeListener = (e) => {
			const canvas = canvasRef.current;
			if (canvas) {
				const canvasSize = getCanvasSize();
				canvas.width = canvasSize.width;
				canvas.height = canvasSize.height;
				maze.setupCells();
				renderer.renderMaze();
			}
		};
		windowResizeListenerRef.current = windowResizeListener;
		window.addEventListener("resize", windowResizeListener);

		return () => {
			//TODO: Cleanup!!
			if (windowResizeListenerRef) window.removeEventListener("resize", windowResizeListenerRef.current);
		};
	}, []);

	//runs when component is mounted
	useEffect(() => {
		//give renderer canvas context when component is mounted
		renderer.setCanvasContext(canvasRef.current.getContext("2d"));
		maze.setupCells();
		renderer.renderMaze();
	}, []);

	useEffect(() => {
		renderer.fill();
		maze.fillCells();
		if (generated) {
			let i = 0;
			const interval = setInterval(() => {
				const cell = {
					x: generated[i][1] * maze.cellSize,
					y: generated[i][0] * maze.cellSize,
					color: "white",
					type: "path",
				};
				renderer.queueAnimation(cell);
				maze.addWall(cell);
				i++;
				if (i >= generated.length) {
					clearInterval(interval);
				}
			}, 10);
		}
	}, [generated]);

	//runs when clearCanvas changes
	useEffect(() => {
		if (clearCanvas) {
			maze.clearCells();
			renderer.clear();
			maze.setupCells();
			renderer.renderMaze();
			onClearCanvas();
		}
	}, [clearCanvas, onClearCanvas]);

	function setRef(ref) {
		if (!ref) return;
		canvasRef.current = ref;
		setCanvasRef(ref);
	}

	//returns canvas size - width and height
	//also sets cellSize
	function getCanvasSize() {
		const winWidth = Math.floor(window.innerWidth) - 10;
		const rem = winWidth % maze.cols;
		maze.cellSize = Math.floor((winWidth - rem) / maze.cols);
		const canvasSize = { width: winWidth - rem, height: maze.rows * maze.cellSize };
		return canvasSize;
	}

	//callback function that runs when mouse button is pressed and mouse is moving on canvas - loop function
	function handleDraw(ctx, point, prevPoint, rightClick) {
		prevPoint = prevPoint ? prevPoint : point;
		const points = interpolate(prevPoint, point, 0.2);

		points.forEach((point) => {
			const cell = maze.getCellAtPos(point);
			if (rightClick) {
				maze.clearCell(cell);
				renderer.clearCell(cell);
			} else {
				//only works in this order for some reason
				renderer.queueAnimation(cell);
				maze.addWall(cell);
			}

			// const surr = getSurroundingCells(point);
			// const cells = [...surr];

			// let i = 0;
			// const interval = setInterval(() => {
			// 	renderer.queueAnimation(cells[i]);
			// 	maze.addWall(cells[i]);
			// 	i++;
			// 	if (i >= cells.length) clearInterval(interval);
			// }, 200);
		});
	}

	function getSurroundingCells(point) {
		const surrPixels = [];
		const { rowIndex, colIndex } = getCellIndices(point);
		if (colIndex + 1 <= maze.cols) {
			surrPixels.push(maze.cells[rowIndex][colIndex + 1]);
		}
		if (rowIndex + 1 <= maze.cols) {
			surrPixels.push(maze.cells[rowIndex + 1][colIndex]);
		}
		if (colIndex - 1 >= 0) {
			surrPixels.push(maze.cells[rowIndex][colIndex - 1]);
		}
		if (rowIndex - 1 >= 0) {
			surrPixels.push(maze.cells[rowIndex - 1][colIndex]);
		}

		return surrPixels;
	}

	function getCellIndices(cell) {
		return {
			rowIndex: Math.floor(cell.y < 0 ? 0 : cell.y / maze.cellSize),
			colIndex: Math.floor(cell.x < 0 ? 0 : cell.x / maze.cellSize),
		};
	}
	//---------------------------------------------//
	return (
		<section className="canvas-section">
			{/*ref prop takes a function and passes in the reference of canvas*/}
			<canvas
				width={getCanvasSize().width}
				height={getCanvasSize().height}
				onMouseDown={onMouseDown}
				onMouseMove={onMouseMove}
				ref={setRef}
				className="canvas"
				onContextMenu={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
			></canvas>
		</section>
	);
}

export default CanvasSection;
