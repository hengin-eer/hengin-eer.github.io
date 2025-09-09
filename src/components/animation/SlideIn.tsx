import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type ReactNode, useRef } from "react";

interface Props {
	direction: "left" | "right";
	delay?: number;
	children: ReactNode;
}

export default function SlideIn({ direction, delay = 0, children }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			gsap.from(containerRef.current, {
				x: direction === "left" ? -200 : 200,
				opacity: 0,
				delay,
				duration: 0.6,
				ease: "power2.out",
			});
		},
		{ scope: containerRef },
	);

	return <div ref={containerRef}>{children}</div>;
}
