"use client";
import * as React from 'react';
import peaks, { Segment } from 'peaks.js';

export default function usePeaks() {
	const peaksRef = React.useRef<HTMLDivElement>(null);
	const peaksInstanceRef = React.useRef<any>(null);

	React.useEffect(() => {
		if (peaksRef.current) {
			const options = {
				container: peaksRef.current,
				zoomLevels: [window.innerWidth],
				zoomview: {
					container: peaksRef.current.querySelector('#zoomview-container')
				},
				overview: {
					container: peaksRef.current.querySelector('#overview-container')
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
					id: "user-selection"
				});

				console.log("Segments:", peaksInstanceRef.current.segments);
				console.log("Segment:", peaksInstanceRef.current.segments.getSegment('user-selection'));
			});

			peaksInstanceRef.current.on('segments.click', function (segment: Segment) {
				peaksInstanceRef.current.player.playSegment(segment)
			});
		}
	}, []);

	return peaksRef;
}
