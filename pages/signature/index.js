import { useEffect, useRef, useState } from "react"
import { useSignatureStore } from "../../store/signature";
import { useRouter } from 'next/router'
import Link from "next/link";

export default function Signature() {
    const router = useRouter();
    const canvasRef = useRef(0);
    const posRef = useRef({
        x: 0, 
        y: 0,
    })
    const isPainting = useRef(false);
    const ctxRef = useRef(0);
    const [canvasHeight, setCanvasHeight] = useState(0);

    const cnvSize = useRef({
        h: 0,
        w: 0,
    })

    const signatureStore = useSignatureStore();

    useEffect(() => {
        if(window !== undefined)
            drawOnCanvas();
    }, [])

    function drawOnCanvas(){
        cnvSize.current.h = window.innerHeight * 0.5 > 200 ? 200 : window.innerHeight * 0.5;
        cnvSize.current.w = window.innerWidth * 0.9 > 600 ? 600 : window.innerWidth * 0.9;
        // cnvSize.current.w = window.innerWidth;

        canvasRef.current.width = cnvSize.current.w;
        canvasRef.current.height = cnvSize.current.h;

        const ctx = canvasRef.current.getContext("2d");
        setCanvasHeight(cnvSize.current.h);
        ctx.lineWidth = 3;
        ctx.lineCap = "round"
        ctxRef.current = ctx
    }

    const onMouseDown = (e) => {
        isPainting.current = true;
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
    }

    const onMouseMove = (e) => {
        if (!isPainting.current) return;
        drawLine(posRef.current.x, posRef.current.y, e.clientX, e.clientY);
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
    }
    const onMouseUp = (e) => {
        if (!isPainting.current) return;
        isPainting.current = false;
        drawLine(posRef.current.x, posRef.current.y, e.clientX, e.clientY);
    }

    const drawLine = (x0, y0, x1, y1) => {
        const rect = canvasRef.current.getBoundingClientRect();

        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x0 - rect.left, y0 - rect.top);
        ctxRef.current.lineTo(x1 - rect.left, y1 - rect.top);
        ctxRef.current.stroke();
        ctxRef.current.closePath();
        ctxRef.current.save();
    }

    const clearCanvas = () => {
        ctxRef.current.clearRect(0, 0, cnvSize.current.w, cnvSize.current.h);
    }

    const done = () => {
        const base64ImageData = canvasRef.current.toDataURL("image/png");
        signatureStore.setImage(base64ImageData, cnvSize.current.w, cnvSize.current.h);
        router.push('/');
    }

    return (
        <div className="">
            <canvas 
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                className="canvas mt-2" 
            ></canvas>
            <div
                style={{ marginTop: canvasHeight+'px' }}
                className="pt-5 w-[90%] max-w-[600px] m-auto"
            >
                <div className="font-mono">Draw Your Signature</div>
                <div className="flex justify-end gap-3 pt-2">
                    <Link className="btn btn-secondary" href="/"> 
                        Back
                    </Link>
                    <button 
                        className="btn btn-secondary"
                        onClick={clearCanvas}>
                        Clear</button>
                    <button 
                        className="btn btn-primary"
                        onClick={done}>
                            Done
                    </button>
                </div>
            </div>
        </div>
    )
}
