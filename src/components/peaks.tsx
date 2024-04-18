"use client";
import * as React from 'react';
import peaks from 'peaks.js';
import { useEffect, useRef } from 'react';

export default function Peak({ url }: { url: string }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) {
			const options = {
				container: ref.current,
				zoomview: {
					container: ref.current.querySelector('#zoomview-container')
				},
				overview: {
					container: ref.current.querySelector('#overview-container')
				},
				mediaElement: ref.current.querySelector('#audio') as Element,
				webAudio: {
					audioContext: new AudioContext(),
					scale: 128,
					multiChannel: false
				}
			};

			const peaksInstance = peaks.init({
				...options
			});

			return () => {
				peaksInstance.destroy();
			};
		}
	}, [url]);

	return <div ref={ref} />;
}
