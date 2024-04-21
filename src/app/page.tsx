"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Peak from "@/components/peaks/peaks";
import styles from "@/components/peaks/peaks.module.css"
import { useEffect, useRef } from "react";
import usePeaks from "@/components/peaks/peaks";

export default function Home() {
	const audioRef = useRef<HTMLAudioElement>(null);
	// Usage
	function PeakComponent() {
		const peaksRef = usePeaks();

		return <div ref={peaksRef} />;
	}

	document.addEventListener('DOMContentLoaded', () => {
		document.getElementById('audio')?.addEventListener('loadeddata', () => {
			
		})
	})

	return (
		<div className="bg-container w-full h-96 absolute bottom-0" id="waveform">
			<div className="overview-container"></div>
			<div className="zoomview-container"></div>
			<audio id="audio" ref={audioRef} src="./audio.mp3">
				{PeakComponent()}
			</audio>
		</div>
	);
}
