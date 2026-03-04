import React from "react";
import {
	AbsoluteFill,
	Sequence,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	Easing,
} from "remotion";

const FONT_FAMILY = "Inter, sans-serif";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const useFitText = (text: string, maxWidth: number, baseFontSize: number) => {
	// Simple heuristic fit: scale down by length vs baseline.
	const len = Math.max(1, text.length);
	const baseline = 18; // tuned for short headlines
	const ratio = clamp(baseline / len, 0.62, 1);
	const scaled = baseFontSize * ratio;
	// Additional gentle cap based on available width (very rough, deterministic).
	const widthFactor = clamp(maxWidth / 1100, 0.7, 1);
	return scaled * widthFactor;
};

const TitleCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height, durationInFrames} = useVideoConfig();

	const t = frame / fps;

	const introIn = 16;
	const titleIn = 26;

	const introOpacity = interpolate(frame, [0, introIn], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const introY = interpolate(frame, [0, introIn], [18, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const titleOpacity = interpolate(frame, [8, titleIn], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const titleY = interpolate(frame, [8, titleIn], [26, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const settle = interpolate(frame, [titleIn, titleIn + 18], [0.98, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const vignetteOpacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.quad),
	});

	const maxTextWidth = Math.min(width * 0.9, 1200);
	const introSize = useFitText("Introducing", maxTextWidth, Math.min(height * 0.06, 56));
	const titleSize = useFitText(
		"The AI Workflow Builder",
		maxTextWidth,
		Math.min(height * 0.105, 96),
	);

	const bgShift = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const g1x = 20 + bgShift * 10;
	const g2x = 78 - bgShift * 8;

	return (
		<AbsoluteFill
			style={{
				fontFamily: FONT_FAMILY,
				backgroundColor: "#070A12",
				overflow: "hidden",
			}}
		>
			{/* Gradient backdrop */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(1200px 700px at ${g1x}% 30%, rgba(96,165,250,0.35) 0%, rgba(96,165,250,0.08) 35%, rgba(0,0,0,0) 70%),
radial-gradient(900px 600px at ${g2x}% 55%, rgba(167,139,250,0.30) 0%, rgba(167,139,250,0.07) 40%, rgba(0,0,0,0) 70%),
linear-gradient(180deg, #070A12 0%, #050611 55%, #04040B 100%)`,
				}}
			/>
			{/* Subtle grid */}
			<AbsoluteFill
				style={{
					opacity: 0.22,
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
					backgroundSize: "64px 64px",
					backgroundPosition: "center",
					maskImage:
						"radial-gradient(75% 60% at 50% 40%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0) 100%)",
					WebkitMaskImage:
						"radial-gradient(75% 60% at 50% 40%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0) 100%)",
				}}
			/>

			{/* Vignette */}
			<AbsoluteFill
				style={{
					opacity: vignetteOpacity,
					background:
						"radial-gradient(1200px 700px at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.7) 100%)",
				}}
			/>

			{/* Content */}
			<AbsoluteFill
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: 80,
				}}
			>
				<div
					style={{
						width: "100%",
						maxWidth: 1200,
						textAlign: "center",
						transform: `scale(${settle})`,
					}}
				>
					{/* Overline */}
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 10,
							padding: "10px 14px",
							borderRadius: 999,
							border: "1px solid rgba(255,255,255,0.12)",
							background: "rgba(255,255,255,0.04)",
							backdropFilter: "blur(6px)",
							WebkitBackdropFilter: "blur(6px)",
							transform: `translateY(${introY}px)`,
							opacity: introOpacity,
						}}
					>
						<span
							style={{
								width: 8,
								height: 8,
								borderRadius: 999,
								background: "linear-gradient(180deg, #60A5FA, #A78BFA)",
								boxShadow: "0 0 18px rgba(167,139,250,0.35)",
							}}
						/>
						<span
							style={{
								color: "rgba(255,255,255,0.88)",
								fontSize: introSize,
								fontWeight: 600,
								letterSpacing: 0.2,
								lineHeight: 1,
							}}
						>
							Introducing
						</span>
					</div>

					{/* Headline */}
					<div style={{height: 18}} />
					<div
						style={{
							transform: `translateY(${titleY}px)`,
							opacity: titleOpacity,
						}}
					>
						<div
							style={{
								fontSize: titleSize,
								fontWeight: 800,
								letterSpacing: -1.2,
								lineHeight: 1.05,
								color: "white",
								textShadow: "0 16px 50px rgba(0,0,0,0.45)",
								margin: 0,
							}}
						>
							<span
								style={{
									background:
										"linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.92) 35%, rgba(255,255,255,0.88) 60%, rgba(255,255,255,0.96) 100%)",
									WebkitBackgroundClip: "text",
									backgroundClip: "text",
									color: "transparent",
								}}
							>
								The AI Workflow Builder
							</span>
						</div>

						{/* Accent underline */}
						<div
							style={{
								margin: "18px auto 0",
								height: 4,
								width: Math.min(maxTextWidth * 0.52, 520),
								borderRadius: 999,
								background:
									"linear-gradient(90deg, rgba(96,165,250,0) 0%, rgba(96,165,250,0.9) 20%, rgba(167,139,250,0.9) 80%, rgba(167,139,250,0) 100%)",
								opacity: 0.85,
								filter: "blur(0px)",
								boxShadow: "0 10px 40px rgba(96,165,250,0.18)",
							}}
						/>
					</div>

					{/* Micro UI hint (optional, subtle) */}
					<div
						style={{
							marginTop: 34,
							display: "flex",
							justifyContent: "center",
							opacity: interpolate(frame, [22, 40], [0, 1], {
								extrapolateLeft: "clamp",
								extrapolateRight: "clamp",
								easing: Easing.out(Easing.cubic),
							}),
						}}
					>
						<div
							style={{
								width: Math.min(maxTextWidth, 980),
								borderRadius: 18,
								border: "1px solid rgba(255,255,255,0.10)",
								background:
									"linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)",
								boxShadow:
									"0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
								padding: "14px 16px",
								display: "flex",
								alignItems: "center",
								gap: 10,
								backdropFilter: "blur(10px)",
								WebkitBackdropFilter: "blur(10px)",
								transform: `translateY(${interpolate(frame, [22, 40], [10, 0], {
									extrapolateLeft: "clamp",
									extrapolateRight: "clamp",
									easing: Easing.out(Easing.cubic),
								})}px)`,
							}}
						>
							<div style={{display: "flex", gap: 8}}>
								<div style={{width: 10, height: 10, borderRadius: 999, background: "rgba(255,99,132,0.9)"}} />
								<div style={{width: 10, height: 10, borderRadius: 999, background: "rgba(255,205,86,0.9)"}} />
								<div style={{width: 10, height: 10, borderRadius: 999, background: "rgba(75,192,192,0.9)"}} />
							</div>
							<div style={{flex: 1, display: "flex", gap: 10, alignItems: "center"}}>
								<div
									style={{
										height: 10,
										width: "22%",
										borderRadius: 999,
										background: "rgba(255,255,255,0.10)",
									}}
								/>
								<div
									style={{
										height: 10,
										width: "34%",
										borderRadius: 999,
										background: "rgba(96,165,250,0.22)",
									}}
								/>
								<div
									style={{
										height: 10,
										width: "18%",
										borderRadius: 999,
										background: "rgba(167,139,250,0.20)",
									}}
								/>
							</div>
							<div
								style={{
									padding: "8px 10px",
									borderRadius: 12,
									border: "1px solid rgba(255,255,255,0.12)",
									background: "rgba(255,255,255,0.04)",
									color: "rgba(255,255,255,0.82)",
									fontSize: 14,
									fontWeight: 600,
									letterSpacing: 0.2,
									whiteSpace: "nowrap",
								}}
							>
								Build → Run → Iterate
							</div>
						</div>
					</div>
				</div>
			</AbsoluteFill>

			{/* Gentle fade out at end */}
			<AbsoluteFill
				style={{
					backgroundColor: "#050611",
					opacity: interpolate(
						frame,
						[Math.max(0, durationInFrames - 18), durationInFrames - 1],
						[0, 1],
						{
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
							easing: Easing.in(Easing.cubic),
						},
					),
				}}
			/>
		</AbsoluteFill>
	);
};

const AiWorkflowBuilderDemo: React.FC = () => {
	return (
		<AbsoluteFill>
			<Sequence from={0}>
				<TitleCard />
			</Sequence>
		</AbsoluteFill>
	);
};

export default AiWorkflowBuilderDemo;