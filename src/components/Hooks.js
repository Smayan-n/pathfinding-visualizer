//file defines custom hooks
import { useEffect, useRef } from "react";
import { SimpleCanvas } from "../scripts/CanvasHelper.js";
import { lerp } from "../scripts/Utility.js";

function useOnDraw(onDraw) {
	//use ref does not trigger re-render when value is changed
	const canvasRef = useRef(null);
	const mouseDownRef = useRef(false);
	const mouseButtonRef = useRef(null);
	const prevPosRef = useRef(null);

	const mouseUpListenerRef = useRef(null);

	useEffect(() => {
		//setup mouseUp listener on window
		function initMouseUpListener() {
			const mouseUpListener = (e) => {
				mouseDownRef.current = false;
				//reset prevPoint
				prevPosRef.current = null;
			};
			mouseUpListenerRef.current = mouseUpListener;
			window.addEventListener("mouseup", mouseUpListener);
		}
		initMouseUpListener();

		return () => {
			//cleanup listener on unmount
			if (mouseUpListenerRef.current) window.removeEventListener("mouseup", mouseUpListenerRef.current);
		};
	}, []);

	const setCanvasRef = (ref) => {
		//gets called on every render of canvasSection component and sets canvasRef
		if (!ref) return;
		canvasRef.current = ref;
	};

	const onMouseDown = (e) => {
		//e.button - 0: left, 2: right
		mouseButtonRef.current = e.button;
		mouseDownRef.current = true;
		onMouseMove(e);
	};

	const onMouseMove = (e) => {
		const point = getPointOnCanvas(e.clientX, e.clientY);
		// if (mouseDownRef.current) {
		const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
		onDraw(ctx, point, prevPosRef.current, mouseDownRef.current, mouseButtonRef.current === 2);
		prevPosRef.current = point;
		// }
	};

	const getPointOnCanvas = (x, y) => {
		const rect = canvasRef.current.getBoundingClientRect();
		return { x: x - rect.left, y: y - rect.top };
	};

	return { onMouseDown, onMouseMove, setCanvasRef };
}

export { useOnDraw };
