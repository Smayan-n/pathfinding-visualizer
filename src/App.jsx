import { useState } from "react";
import CanvasSection from "./components/CanvasSection.jsx";
import ControlSection from "./components/ControlSection.jsx";
import dfsGenerator from "./scripts/generationAlgorithms/DFSGeneration.js";
import primsAlgorithm from "./scripts/generationAlgorithms/PrimsAlgorithm.js";
import recursiveDivision from "./scripts/generationAlgorithms/RecursiveDivision.js";
import { randInt } from "./scripts/Utility.js";
import "./styles/App.css";

function App() {
	const [clearCanvas, setClearCanvas] = useState(false);
	const [generated, setGenerated] = useState(null);

	function handleClearCanvas() {
		setClearCanvas(!clearCanvas);
	}

	function handleGenerate(option) {
		//option: 0 = DFS, 1 = Recursive Division, 2 = Prim's Algorithm
		const rows = 28;
		const cols = 60;
		const start = new Array(rows);
		for (let i = 0; i < rows; i++) {
			start[i] = new Array(cols).fill(1);
		}

		//array with all walls/path
		const fill = [];
		let generated = [];
		if (option == 0) {
			//DFS
			generated = dfsGenerator(start, fill);
		} else if (option == 1) {
			//Recursive Division
			generated = recursiveDivision(start, fill, { start: 0, end: rows }, { start: 0, end: cols });
		} else if (option == 2) {
			//Prim's Algorithm
			generated = primsAlgorithm(start, fill);
		}

		setGenerated({ option: option, generated: fill });
	}

	return (
		<section className="main-app">
			<ControlSection onGenerate={handleGenerate} onClearCanvas={handleClearCanvas}></ControlSection>
			<CanvasSection generated={generated} clearCanvasProps={[clearCanvas, handleClearCanvas]}></CanvasSection>
		</section>
	);
}

export default App;
