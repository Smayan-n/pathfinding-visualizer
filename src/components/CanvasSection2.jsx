import { useEffect, useRef, useState } from "react";
import { SimpleCanvas } from "../scripts/CanvasHelper.js";
import Maze from "../scripts/Maze.js";
import CanvasRenderer from "../scripts/Renderer.js";
import { distance, interpolate, lerp } from "../scripts/Utility.js";
import "../styles/CanvasSection.css";
import { useOnDraw } from "./Hooks.js";

function CanvasSection(props) {
	const [clearCanvas, onClearCanvas] = props.clearCanvasProps;

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
		renderer.setCanvasContext(canvasRef.current.getContext("2d"));
		maze.setupCells();
		renderer.renderMaze();
	}, []);

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
			const cell = getCellAtPos(point);
			if (rightClick) {
				maze.clearCell(cell);
				renderer.clearCell(cell);
			} else {
				//only works in this order for some reason
				renderer.queueAnimation(cell);
				maze.addWall(cell);
			}
		});
	}

	//returns a cell at given x, y coord
	function getCellAtPos(point) {
		const indices = getCellIndices(point);
		return maze.cells[indices.rowIndex][indices.colIndex];
	}

	function getCellIndices(point) {
		return {
			rowIndex: Math.floor(point.y < 0 ? 0 : point.y / maze.cellSize),
			colIndex: Math.floor(point.x < 0 ? 0 : point.x / maze.cellSize),
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
