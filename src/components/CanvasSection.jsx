import { useEffect, useRef, useState } from "react";
import { SimpleCanvas } from "../scripts/CanvasHelper.js";
import { distance, indexEquals, interpolate, lerp } from "../scripts/Utility.js";
import "../styles/CanvasSection.css";
import { useOnDraw } from "./Hooks.js";

function CanvasSection(props) {
	const { generated, pathfindSolution, clearCanvasProps, functionalObjects } = props;
	const [clearCanvas, onClearCanvas] = clearCanvasProps;
	const [maze, renderer] = functionalObjects;

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
	}, [clearCanvas, generated, pathfindSolution]);

	useEffect(() => {
		const generateMaze = async () => {
			//clear or fill cells depending on algorithm
			if (generated.option == 0 || generated.option == 2) {
				maze.fillCells();
				await renderer.queueFullAnimation("fill");
			} else {
				maze.clearCells();
				await renderer.queueFullAnimation("clear");
			}

			await renderer.queueStatesAnimation(generated.generated, generated.option == 1 ? "wall" : "path", 10);
		};
		if (generated) generateMaze();
	}, [generated]);

	useEffect(() => {
		const pathfind = async () => {
			//clear all explored and solution cells
			maze.clearCells("explored");
			maze.clearCells("solution");
			await renderer.queueFullAnimation("clear");

			setTimeout(async () => {
				const { solution, explored } = pathfindSolution;

				if (solution) {
					await renderer.queueStatesAnimation(explored, "explored", 15);
					//to ensure complete animation
					setTimeout(async () => await renderer.queueStatesAnimation(solution, "solution", 25), 50);
				} else {
					await renderer.queueStatesAnimation(explored, "explored", 15);
					console.log("No solution found");
				}
			}, 100);
		};
		if (pathfindSolution) pathfind();
	}, [pathfindSolution]);

	//runs when clearCanvas changes
	useEffect(() => {
		const clear = async () => {
			maze.clearCells();
			await renderer.queueFullAnimation("clear");
			//after delay to ensure complete clear animation
			setTimeout(() => onClearCanvas(), 500);
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
		if (indexEquals(maze.start, maze.getCellIndex(point)) || indexEquals(maze.end, maze.getCellIndex(point))) {
			canvasRef.current.style.cursor = "grabbing";
		} else {
			canvasRef.current.style.cursor = "pointer";
		}

		if (mouseDown) {
			prevPoint = prevPoint ? prevPoint : point;
			const points = interpolate(prevPoint, point, 0.1);

			points.forEach((point) => {
				//note. CAUTION: cell is a reference to the cell in maze.cells - might break
				const index = maze.getCellIndex(point);

				//for moving start and end cells
				if (indexEquals(index, maze.start)) {
					maze.onStartClick = true;
				}
				if (indexEquals(index, maze.end)) {
					maze.onEndClick = true;
				}
				if (maze.onStartClick) {
					const oldStart = maze.setStart(index);
					renderer.drawCell(oldStart);
					renderer.drawCell(index);
					return;
				}
				if (maze.onEndClick) {
					const oldEnd = maze.setEnd(index);
					renderer.drawCell(oldEnd);
					renderer.drawCell(index);
					return;
				}

				//for adding and erasing walls
				if (rightClick) {
					maze.addCell(index, "path");
					renderer.queueAnimation(index);
				} else {
					maze.addCell(index, "wall");
					renderer.queueAnimation(index);
				}
			});
		}
		maze.onStartClick = false;
		maze.onEndClick = false;
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
