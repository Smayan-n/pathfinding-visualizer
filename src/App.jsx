import { useState } from "react";
import CanvasSection from "./components/CanvasSection.jsx";
import ControlSection from "./components/ControlSection.jsx";
import Maze from "./scripts/Maze.js";
import CanvasRenderer from "./scripts/Renderer.js";
import { randInt } from "./scripts/Utility.js";
import dfsGenerator from "./scripts/generationAlgorithms/DFSGeneration.js";
import primsAlgorithm from "./scripts/generationAlgorithms/PrimsAlgorithm.js";
import recursiveDivision from "./scripts/generationAlgorithms/RecursiveDivision.js";
import pathfind from "./scripts/pathfindingAlgorithms/Pathfinding.js";
import "./styles/App.css";

function App() {
	const [clearCanvas, setClearCanvas] = useState(false);
	const [generated, setGenerated] = useState(null);
	const [pathfindSolution, setPathfindSolution] = useState(null);

	const [maze, setMaze] = useState(new Maze());
	const [renderer, setRenderer] = useState(new CanvasRenderer(maze));

	const [numStates, setNumStates] = useState({ explored: 0, solution: 0 });

	const [dimsChange, setDimsChange] = useState(0);

	const [showPopup, setShowPopup] = useState(false);

	function handleClosePopup() {
		setShowPopup(false);
	}

	function handleGridDimsChange(dims) {
		console.log(dims);
		maze.setDimensions(dims.rows, dims.cols);
		setDimsChange(!dimsChange);
	}

	function handleNumStatesChange(changed) {
		const { explored, solution } = changed;
		//if explored is -1, it is total explored states
		//if solution is -1, there is no solution
		setNumStates({
			explored: explored === -1 ? pathfindSolution.explored.length : explored,
			solution: solution,
		});
	}

	function handleClearCanvas() {
		setClearCanvas(!clearCanvas);
	}

	function handleSpeedChange(newSpeed) {
		renderer.setAnimSpeed(newSpeed);
	}

	function handlePathfind(option) {
		const { solution, explored } = pathfind(maze, option);

		setPathfindSolution({ option: option, solution: solution, explored: explored });
	}

	function handleGenerate(option) {
		//option: 0 = DFS, 1 = Recursive Division, 2 = Prim's Algorithm
		const start = new Array(maze.rows);
		for (let i = 0; i < maze.rows; i++) {
			start[i] = new Array(maze.cols).fill(1);
		}

		//array with all walls/path
		const fill = [];
		let generatedOut = [];
		if (option == 0) {
			//DFS
			generatedOut = dfsGenerator(start, fill);
		} else if (option == 1) {
			//Recursive Division
			generatedOut = recursiveDivision(start, fill, { start: 0, end: maze.rows }, { start: 0, end: maze.cols });
		} else if (option == 2) {
			//Prim's Algorithm
			console.log(maze.rows, maze.cols);
			generatedOut = primsAlgorithm(start, fill);
		}

		setGenerated({ option: option, generated: fill });
	}

	return (
		<section className="main-app">
			<ControlSection
				onPathfind={handlePathfind}
				onGenerate={handleGenerate}
				onClearCanvas={handleClearCanvas}
				onGridDimsChange={handleGridDimsChange}
				onSpeedChange={handleSpeedChange}
				numStates={numStates}
				renderer={renderer}
				maze={maze}
			></ControlSection>
			<CanvasSection
				dimsChange={dimsChange}
				generated={generated}
				pathfindSolution={pathfindSolution}
				functionalObjects={[maze, renderer]}
				clearCanvasProps={[clearCanvas, handleClearCanvas]}
				onNumStatesChange={handleNumStatesChange}
			></CanvasSection>
		</section>
	);
}

export default App;
