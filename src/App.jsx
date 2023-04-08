import { useState } from "react";
import CanvasSection from "./components/CanvasSection.jsx";
import ControlSection from "./components/ControlSection.jsx";
import dfsGenerator from "./scripts/generationAlgorithms/DFSGeneration.js";
import primsAlgorithm from "./scripts/generationAlgorithms/PrimsAlgorithm.js";
import recursiveDivision from "./scripts/generationAlgorithms/RecursiveDivision.js";
import Maze from "./scripts/Maze.js";
import pathfind from "./scripts/pathfindingAlgorithms/Pathfinding.js";
import CanvasRenderer from "./scripts/Renderer.js";
import { randInt } from "./scripts/Utility.js";
import "./styles/App.css";

function App() {
	const [clearCanvas, setClearCanvas] = useState(false);
	const [generated, setGenerated] = useState(null);
	const [pathfindSolution, setPathfindSolution] = useState(null);

	const [maze, setMaze] = useState(new Maze());
	const [renderer, setRenderer] = useState(new CanvasRenderer(maze));

	function handleClearCanvas() {
		setClearCanvas(!clearCanvas);
	}

	function handlePathfind(option) {
		const { solution, explored } = pathfind(maze, option);
		console.log(explored.length, solution.length);

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
		let generated = [];
		if (option == 0) {
			//DFS
			generated = dfsGenerator(start, fill);
		} else if (option == 1) {
			//Recursive Division
			generated = recursiveDivision(start, fill, { start: 0, end: maze.rows }, { start: 0, end: maze.cols });
		} else if (option == 2) {
			//Prim's Algorithm
			generated = primsAlgorithm(start, fill);
		}

		setGenerated({ option: option, generated: fill });
	}

	return (
		<section className="main-app">
			<ControlSection
				onPathfind={handlePathfind}
				onGenerate={handleGenerate}
				onClearCanvas={handleClearCanvas}
			></ControlSection>
			<CanvasSection
				generated={generated}
				pathfindSolution={pathfindSolution}
				functionalObjects={[maze, renderer]}
				clearCanvasProps={[clearCanvas, handleClearCanvas]}
			></CanvasSection>
		</section>
	);
}

export default App;
