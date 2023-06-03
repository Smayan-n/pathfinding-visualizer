import "../styles/Dropdown.css";

function DropDown(props) {
	const { title, options, onOptionClick } = props;
	return (
		<div className="dropdown">
			<button className="dropdown-btn">
				{title}
				<i className="arrow down"></i>
			</button>
			<div className="dropdown-content">
				{options.map((option, idx) => (
					<div key={idx} value={idx} onClick={onOptionClick}>
						{option}
					</div>
				))}
			</div>
		</div>
	);
}

export default DropDown;
