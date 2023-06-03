import React, { useRef } from "react";
import "../styles/InputDropdown.css";

function InputDropdown(props) {
	const { title, type, onInputChange } = props;
	const rowsInputRef = useRef(null);
	const colsInputRef = useRef(null);
	return (
		<div className="dropdown">
			<button className="dropdown-btn">
				{title}
				<i className="arrow down"></i>
			</button>
			<div className="dropdown-content">
				{type === "input" ? (
					<section className="dims-input-section">
						<label htmlFor="rows-input">Rows: </label>
						<input
							onChange={(e) => {
								onInputChange(e.target.value, colsInputRef.current.value);
							}}
							ref={rowsInputRef}
							type="range"
							id="rows-input"
							min="4"
							max="50"
							defaultValue="18"
						/>
						<label htmlFor="cols-input">Columns: </label>
						<input
							onChange={(e) => {
								onInputChange(rowsInputRef.current.value, e.target.value);
							}}
							ref={colsInputRef}
							type="range"
							id="cols-input"
							min="10"
							max="100"
							defaultValue="50"
						/>
					</section>
				) : (
					<section className="speed-input-section">
						<label htmlFor="speed-input">Fast</label>
						<input
							onChange={(e) => {
								onInputChange(21 - parseInt(e.target.value));
							}}
							type="range"
							orient="vertical"
							id="speed-input"
							min="1"
							max="20"
							defaultValue="10"
							step="1"
						/>
						<label htmlFor="speed-input">slow</label>
					</section>
				)}
			</div>
		</div>
	);
}

export default InputDropdown;
