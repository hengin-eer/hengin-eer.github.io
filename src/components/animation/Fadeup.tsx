import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ReactNode, useRef } from "react";

interface FadeupProps {
	delay?: number;
	children: ReactNode;
}

export default function Fadeup({ delay = 0, children }: FadeupProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			gsap.from(containerRef.current, {
				scrollTrigger: {
					trigger: containerRef.current,
					start: "top 90%",
					toggleActions: "play none none none",
				},
				y: 120,
				opacity: 0,
				/**
				 * TODO: 表示できている部分まではこのままindex利用で良いが、一度連続したフェードアップが終わったら、もう一度delayを0にして再スタートしたい
				 * 現状、フェードアップにスクロールが間に合わなければ、indexの分だけ表示に遅れが生じる
				 */
				delay,
				duration: 0.6,
				ease: "power2.out",
			});
		},
		{ scope: containerRef },
	);

	return <div ref={containerRef}>{children}</div>;
}
