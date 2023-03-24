import { useEffect, useRef, useState } from "react";
import { SimpleCanvas } from "../scripts/CanvasHelper.js";
import { distance, interpolate, lerp } from "../scripts/Utility.js";
import "../styles/CanvasSection.css";
import { useOnDraw } from "./Hooks.js";

const rows = 28;
const cols = 60;
function CanvasSection(props) {
	const [clearCanvas, onClearCanvas] = props.clearCanvasProps;

	const { onMouseDown, onMouseMove, setCanvasRef } = useOnDraw(handleDraw);
	const windowResizeListenerRef = useRef(null);
	const canvasRef = useRef(null);

	//array that stores top-left positions and color of cells in the grid
	const cellsRef = useRef(null); //object (position and color): {x, y, color}
	//cell size
	const cellSizeRef = useRef(15);

	const animationQueueRef = useRef([]);
	const animationRunningRef = useRef(false);

	//effect sets up resize listener and initializes cellPositions
	useEffect(() => {
		const windowResizeListener = (e) => {
			const canvas = canvasRef.current;
			if (canvas) {
				const size = getCanvasSize();
				canvas.width = size.width;
				canvas.height = size.height;
				setupCells();
			}
		};
		windowResizeListenerRef.current = windowResizeListener;
		window.addEventListener("resize", windowResizeListener);

		setupCells();

		return () => {
			//TODO: Cleanup!!
			if (windowResizeListenerRef) window.removeEventListener("resize", windowResizeListenerRef.current);
		};
	}, []);

	useEffect(() => {
		setupCells();
	}, []);

	useEffect(() => {
		if (clearCanvas) {
			const ctx = canvasRef.current.getContext("2d");
			ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
			cellsRef.current = cellsRef.current.map((row) => row.map((cell) => ({ ...cell, color: "white" })));
			onClearCanvas();
			setupCells();
		}
	}, [clearCanvas, onClearCanvas]);

	useEffect(() => {
		initCanvas(canvasRef.current.getContext("2d"));
	}, [cellsRef.current]);

	function setRef(ref) {
		if (!ref) return;
		canvasRef.current = ref;
		setCanvasRef(ref);
	}

	//returns canvas size - width and height
	//also sets cellSize
	function getCanvasSize() {
		const winWidth = Math.floor(window.innerWidth) - 10;
		const rem = winWidth % cols;
		cellSizeRef.current = Math.floor((winWidth - rem) / cols);
		const canvasSize = { width: winWidth - rem, height: rows * cellSizeRef.current };
		return canvasSize;
	}

	//sets up cellsRef.current - positions
	function setupCells() {
		//set up empty 28x28 array
		const newCells = new Array(rows);
		for (let i = 0; i < rows; i++) {
			newCells[i] = new Array(cols);
		}

		//store top-left positions of cellsRef.current in array
		for (let row = 0; row < rows; row += 1) {
			for (let col = 0; col < cols; col += 1) {
				newCells[row][col] = {
					x: col * cellSizeRef.current,
					y: row * cellSizeRef.current,
					color: cellsRef.current ? cellsRef.current[row][col].color : "white",
				};
			}
		}
		cellsRef.current = newCells;
		initCanvas(canvasRef.current.getContext("2d"));
	}

	//draws grid and fills cells with their respective colors
	function initCanvas(ctx) {
		const simpleCanvas = new SimpleCanvas(ctx);
		if (cellsRef.current) {
			cellsRef.current.forEach((row) => {
				row.forEach((cell) => {
					//grid
					simpleCanvas.rect(cell.x, cell.y, cellSizeRef.current, cellSizeRef.current, "", "black", false);
					//color cells
					simpleCanvas.rect(cell.x, cell.y, cellSizeRef.current, cellSizeRef.current, "", cell.color, true);
				});
			});
		}
	}

	//callback function that runs when mouse button is pressed and mouse is moving on canvas - loop function
	function handleDraw(ctx, point, prevPoint, rightClick) {
		prevPoint = prevPoint ? prevPoint : point;
		const points = interpolate(prevPoint, point, 0.2);
		points.forEach((point) => {
			const cell = getCellAtPos(point);
			queueAnimation(ctx, cell);
		});
	}

	function queueAnimation(ctx, cell) {
		const simpleCanvas = new SimpleCanvas(ctx);
		//i is animation counter
		const animation = { cell: cell, i: cellSizeRef.current };
		//only add new animation to queue if cell is not already being animated
		if (
			!animationQueueRef.current.some((anim) => {
				return anim.cell === animation.cell;
			})
		) {
			animationQueueRef.current.push(animation);
			cellsRef.current = cellsRef.current.map((row) => {
				return row.map((cell) => {
					if (cell === animation.cell) {
						cell.color = "brown";
					}
					return cell;
				});
			});
		}

		const animSpeed = 7; //ms

		if (!animationRunningRef.current) {
			animationRunningRef.current = true;

			const interval = setInterval(() => {
				for (let j = 0; j < animationQueueRef.current.length; j++) {
					const animation = animationQueueRef.current[j];
					simpleCanvas.rect(
						animation.cell.x + animation.i / 2,
						animation.cell.y + animation.i / 2,
						cellSizeRef.current - animation.i,
						cellSizeRef.current - animation.i,
						"",
						"brown"
					);
					//decrease animation counter
					animation.i = animation.i - 1;
					animationQueueRef.current[j] = animation;
					//if animation is done, remove it from queue
					if (animation.i < 0) {
						animationQueueRef.current = animationQueueRef.current.filter((a) => a !== animation);
					}
				}

				//if animation queue is empty, stop animation interval
				if (animationQueueRef.current.length === 0) {
					animationRunningRef.current = false;
					clearInterval(interval);
				}
			}, animSpeed);
		}
	}

	//returns a cell at given x, y coord
	function getCellAtPos(point) {
		const indices = getPixelIndices(point);
		return cellsRef.current[indices.rowIndex][indices.colIndex];
	}

	function getPixelIndices(point) {
		return {
			rowIndex: Math.floor(point.y < 0 ? 0 : point.y / cellSizeRef.current),
			colIndex: Math.floor(point.x < 0 ? 0 : point.x / cellSizeRef.current),
		};
	}

	//---------------------------------------------//
	return (
		<section className="canvas-section">
			{/*ref prop takes a function and passes in the reference of canvas*/}
			<canvas
				width={getCanvasSize().width}
				height={getCanvasSize().height}
				// width={1000}
				// height={500}
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
