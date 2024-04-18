"use client";
import * as React from 'react';
import peaks from 'peaks.js';
import { useEffect, useRef } from 'react';

export default function Peak({ url }: { url: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const peaksInstanceRef = useRef<any>(null); // Ref to Peaks.js instance

	useEffect(() => {
		const initializePeaks = () => {
			if (ref.current) {
				const options = {
					container: ref.current,
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
					// Set up a segment
					const startTime = 5; // Start time in seconds
					const endTime = 10; // End time in seconds
					peaksInstanceRef.current.segments.add({
						startTime: startTime,
						endTime: endTime,
						labelText: 'Segment' // Optional label for the segment
					});

					// Play only the segment
					peaksInstanceRef.current.player.playSegment(startTime, endTime);
				});

				return () => {
					if (peaksInstanceRef.current) {
						peaksInstanceRef.current.destroy();
					}
				};
			}
		};

		initializePeaks();
	}, [url]);

	return <div ref={ref} />;
}
