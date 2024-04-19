// app.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Peak from "@/components/peaks/peaks";
import styles from "@/components/peaks/peaks.module.css"

export default function Home() {
	return (
		<div className="bg-container w-full h-96 absolute bottom-0" id="waveform">
			<div className="overview-container"></div>
			<div className="zoomview-container"></div>
			<audio id="audio">
				<source src="./audio.mp3" type="audio/mpeg" />
			</audio>
			<Peak />
		</div>
	);
}
