"use client";
import * as React from 'react';
import peaks, { Segment } from 'peaks.js';
import { useRef } from 'react';

export default function Peak() {
	const ref = useRef<HTMLDivElement>(null);
	const peaksInstanceRef = useRef<any>(null);

	const initializePeaks = () => {
		if (ref.current) {
			const options = {
				container: ref.current,
				zoomLevels: [4096],
				zoomview: {
					container: ref.current.querySelector('#zoomview-container')
				},
				overview: {
					container: ref.current.querySelector('#overview-container')
				},
				mediaElement: document.getElementById('audio') as HTMLMediaElement,
				webAudio: {
					audioContext: new AudioContext(),
					scale: 128,
					multiChannel: false
				}
			};

			peaksInstanceRef.current = peaks.init(options);
			peaksInstanceRef.current.on('peaks.ready', () => {
				const startTime = 20;
				const endTime = 40;
				peaksInstanceRef.current.segments.add({
					startTime: startTime,
					endTime: endTime,
					labelText: 'Segment',
					id: "id-1" 
				});

				console.log("Segments:", peaksInstanceRef.current.segments);
				console.log("Segment:", peaksInstanceRef.current.segments.getSegment('id-1'));
			});

			peaksInstanceRef.current.on('segments.click', function (segment: Segment) {
				peaksInstanceRef.current.player.playSegment(segment)
			});

			return () => {
				if (peaksInstanceRef.current) {
					peaksInstanceRef.current.destroy();
				}
			};
		}
	};

	React.useEffect(() => {
		initializePeaks();

		return () => {
			if (peaksInstanceRef.current) {
				peaksInstanceRef.current.destroy();
			}
		};
	}, []);

	return <div ref={ref} />;
}
