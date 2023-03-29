import { useState } from "react";
import CanvasSection from "./components/CanvasSection.jsx";
import CanvasSection2 from "./components/CanvasSection2.jsx";
import ControlSection from "./components/ControlSection.jsx";
import "./styles/App.css";

function App() {
	const [clearCanvas, setClearCanvas] = useState(false);

	function handleClearCanvas() {
		setClearCanvas(!clearCanvas);
	}
	return (
		<section className="main-app">
			<ControlSection onClearCanvas={handleClearCanvas}></ControlSection>
			<CanvasSection2 clearCanvasProps={[clearCanvas, handleClearCanvas]}></CanvasSection2>
		</section>
	);
}

export default App;
