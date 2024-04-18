// app.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Peak from "@/components/peaks";

export default function Home() {
	return (
		<div className="bg-container w-full h-96 absolute bottom-0" id="waveform">
			<div id="zoomview-container"></div>
			<div id="overview-container"></div>
			<Peak url="./audio.mp3" />
			<audio id="audio">
				<source src="./audio.mp3" type="audio/mpeg" />
			</audio>
		</div>
	);
}
