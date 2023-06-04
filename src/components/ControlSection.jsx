import React, { useRef, useState } from "react";
import { render } from "react-dom";
import "../styles/ControlSection.css";
import DropDown from "./Dropdown";
import InputDropdown from "./InputDropdown";

function ControlSection(props) {
	const { onClearCanvas, onGenerate, onPathfind, onGridDimsChange, numStates, onSpeedChange, renderer, maze } = props;

	const [generationOption, setGenerationOption] = useState(-1);
	const [pathfindingOption, setPathfindingOption] = useState(-1);

	const [animSpeed, setAnimSpeed] = useState(10);
	const [gridDims, setGridDims] = useState({ rows: 18, cols: 50 });

	function handleGenerationOptionClick(e) {
		if (!renderer.visualizationRunning) {
			setGenerationOption(parseInt(e.target.getAttribute("value")));
			setPathfindingOption(-1);
		}
	}

	function handlePathfindingOptionClick(e) {
		if (!renderer.visualizationRunning) {
			setPathfindingOption(parseInt(e.target.getAttribute("value")));
			setGenerationOption(-1);
		}
	}

	function handleStartClick() {
		if (generationOption === -1) {
			onPathfind(pathfindingOption);
		} else {
			onGenerate(generationOption);
		}
	}

	function handleGridDimsChange(rows, cols) {
		const dims = { rows: parseInt(rows), cols: parseInt(cols) };
		setGridDims(dims);
		onGridDimsChange(dims);
	}

	function handleSpeedChange(newSpeed) {
		setAnimSpeed(parseInt(newSpeed));
		onSpeedChange(parseInt(newSpeed));
	}

	const generationAlgorithms = ["DFS Algorithm", "Recursive Division", "Prim's Algorithm"];
	const pathfindingAlgorithms = [
		"Depth-First Search",
		"Breadth-First Search",
		"A* Search",
		"Dijkstra's Algorithm",
		"Greedy Best-First Search",
	];
	const generationAlgorithmsDescriptions = [
		"generates a maze by randomly exploring the grid using depth-first search",
		"generates a maze by recursively dividing the grid with walls, creating passages through random openings",
		"generates a maze by repeatedly adding the nearest empty cell to the maze",
	];
	const pathfindingAlgorithmsDescriptions = [
		"does not guarantee the shortest path and is slow",
		"guarantees the shortest path but is slow",
		"guarantees the shortest path and is fast",
		"guarantees the shortest path and can be fast",
		"does not guarantee the shortest but can be fast",
	];

	const pathfindingAlgorithmsShort = ["DFS", "BFS", "A*", "Dijkstra's", "Greedy"];
	const generationAlgorithmsShort = ["DFS", "Recursive", "Prim's"];

	const getDescription = () => {
		if (generationOption === -1 && pathfindingOption === -1) {
			return "Pick a maze generation or pathfinding algorithm!";
		} else if (generationOption !== -1) {
			return (
				<div>
					<u>{generationAlgorithms[generationOption]}</u> {generationAlgorithmsDescriptions[generationOption]}
				</div>
			);
		} else {
			return (
				<div>
					<u>{pathfindingAlgorithms[pathfindingOption]}</u>{" "}
					{pathfindingAlgorithmsDescriptions[pathfindingOption]}
				</div>
			);
		}
	};
	return (
		<section className="control-section">
			<section className="top-bar">
				<div className="app-title">Pathfinding Visualizer</div>
				<div className="vertical-separator"></div>
				<DropDown
					title="Maze Generation"
					options={generationAlgorithms}
					onOptionClick={handleGenerationOptionClick}
				></DropDown>
				<DropDown
					title="Path Finding"
					options={pathfindingAlgorithms}
					onOptionClick={handlePathfindingOptionClick}
				></DropDown>

				<button
					style={{ backgroundColor: renderer.visualizationRunning ? "gray" : "green" }}
					disabled={(pathfindingOption === -1 && generationOption === -1) || renderer.visualizationRunning}
					onClick={handleStartClick}
					className="start-btn"
				>
					{generationOption !== -1
						? `Generate ${generationAlgorithmsShort[generationOption]}!`
						: pathfindingOption !== -1
						? `Pathfind ${pathfindingAlgorithmsShort[pathfindingOption]}!`
						: "Pick Algorithm"}
				</button>

				<button disabled={renderer.visualizationRunning} onClick={onClearCanvas} className="clear-btn">
					Clear
				</button>

				<InputDropdown
					title={"Speed: " + (21 - animSpeed)}
					type="slider"
					onInputChange={handleSpeedChange}
					visualizationRunning={renderer.visualizationRunning}
				></InputDropdown>
				<InputDropdown
					title={`Grid: [${gridDims.rows} x ${gridDims.cols}] `}
					type="input"
					onInputChange={handleGridDimsChange}
					visualizationRunning={renderer.visualizationRunning}
				></InputDropdown>
			</section>

			<section className="top-description-section">
				{/*Cells legend */}
				<section className="cell-info-section">
					<div className="cell-segment">
						<div>Wall Node: </div>
						<div style={{ backgroundColor: renderer.wallColor }} className="cell-disp"></div>
					</div>
					<div className="cell-segment">
						<div>Empty Node: </div>
						<div style={{ backgroundColor: renderer.pathColor }} className="cell-disp"></div>
					</div>
					<div className="cell-segment">
						<div>Start Node: </div>
						<div style={{ backgroundColor: renderer.startColor }} className="cell-disp"></div>
					</div>
					<div className="cell-segment">
						<div>Goal Node: </div>
						<div style={{ backgroundColor: renderer.endColor }} className="cell-disp"></div>
					</div>
					<div className="cell-segment">
						<div>Explored Node: </div>
						<div style={{ backgroundColor: renderer.exploredColor }} className="cell-disp"></div>
					</div>
					<div className="cell-segment">
						<div>Solution Node: </div>
						<div style={{ backgroundColor: renderer.solutionColor }} className="cell-disp"></div>
					</div>
				</section>

				<section className="states-info-section">
					<section className="states-info">
						<div>Nodes Explored: {numStates.explored}</div>
						{numStates.solution === -1 ? (
							<div style={{ color: "red" }}>No Solution</div>
						) : (
							<div>Solution Nodes: {numStates.solution}</div>
						)}
					</section>
				</section>
			</section>

			<section className="bottom-info-section">{getDescription()}</section>
		</section>
	);
}

export default ControlSection;
