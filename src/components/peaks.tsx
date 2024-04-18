"use client";
import * as React from 'react';
import peaks from 'peaks.js';
import { useEffect, useRef } from 'react';

export default function Peak({ url }: { url: string }) {
	const ref = useRef<HTMLDivElement>(null);

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
					},
					segment: {
						id: "segment1",
						startTime: 0,
						endTime: 30,
						editable: true,
						color: "#ff0000",
						labelText: "My label"
					}
				};

				const peaksInstance = peaks.init(options);
				peaksInstance.on('peaks.ready', () => {
					console.log('Peaks ready!');
					peaksInstance.player.play();
				});
				
				return () => {
					peaksInstance.destroy();
				};
			}
		};

		initializePeaks();
	}, [url]);

	return <div ref={ref} />;
}
