import { useEffect, useRef, useState } from "react";
import { SimpleCanvas } from "../scripts/CanvasHelper.js";
import Maze from "../scripts/Maze.js";
import CanvasRenderer from "../scripts/Renderer.js";
import { distance, indexEquals, interpolate, lerp } from "../scripts/Utility.js";
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

	// effect sets up resize listener and initializes cellPositions
	useEffect(() => {
		const windowResizeListener = (e) => {
			const canvas = canvasRef.current;
			if (canvas) {
				const canvasSize = getCanvasSize();
				canvas.width = canvasSize.width;
				canvas.height = canvasSize.height;
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

	//runs when component is rendered
	useEffect(() => {
		//give renderer canvas context when component is mounted
		renderer.setCanvasContext(canvasRef.current.getContext("2d", { willReadFrequently: true }));
		renderer.renderMaze();
	}, [clearCanvas, generated]);

	useEffect(() => {
		const generateMaze = async () => {
			if (generated.option == 0 || generated.option == 2) {
				maze.fillCells();
				await renderer.queueFullAnimation("fill");
			} else {
				maze.clearCells();
				await renderer.queueFullAnimation("clear");
			}

			let i = 0;
			const interval = setInterval(() => {
				const index = { row: generated.generated[i][0], col: generated.generated[i][1] };
				generated.option == 1 ? maze.addWall(index) : maze.addPath(index);
				renderer.queueAnimation(index);

				i++;
				if (i >= generated.generated.length) {
					clearInterval(interval);
				}
			}, 10);
		};
		if (generated) generateMaze();
	}, [generated]);

	//runs when clearCanvas changes
	useEffect(() => {
		const clear = async () => {
			maze.clearCells();
			await renderer.queueFullAnimation("clear");
			setTimeout(() => onClearCanvas(), 100);
		};
		if (clearCanvas) clear();
	}, [clearCanvas]);

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
	function handleDraw(ctx, point, prevPoint, mouseDown, rightClick) {
		if (mouseDown) {
			prevPoint = prevPoint ? prevPoint : point;
			const points = interpolate(prevPoint, point, 0.1);

			points.forEach((point) => {
				//note. CAUTION: cell is a reference to the cell in maze.cells - might break
				const index = maze.getCellIndex(point);
				if (indexEquals(index, maze.start)) {
					maze.onStart = true;
				} else if (rightClick) {
					maze.addPath(index);
					renderer.queueAnimation(index);
				} else {
					maze.addWall(index);
					renderer.queueAnimation(index);
				}

				if (maze.onStart == false) {
					console.log(maze.onStart);
					maze.setStart(index);
					renderer.renderMaze();
					maze.onStart = null;
				}
			});
		}
		if (maze.onStart) maze.onStart = false;
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
