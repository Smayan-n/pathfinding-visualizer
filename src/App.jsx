import { useState } from "react";
import CanvasSection from "./components/CanvasSection.jsx";
import "./styles/App.css";

function App() {
	const [clearCanvas, setClearCanvas] = useState(false);

	function handleClearCanvas() {
		setClearCanvas(!clearCanvas);
	}
	return (
		<div className="App">
			<button onClick={handleClearCanvas} className="clear-btn">
				Clear
			</button>
			<CanvasSection clearCanvasProps={[clearCanvas, handleClearCanvas]}></CanvasSection>
		</div>
	);
}

export default App;
