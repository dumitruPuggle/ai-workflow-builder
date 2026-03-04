import React from "react";
import {
	AbsoluteFill,
	Sequence,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	Easing,
	spring,
} from "remotion";

const FONT_FAMILY = "Inter, sans-serif";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const useFitText = (text: string, maxWidth: number, baseFontSize: number) => {
	const len = Math.max(1, text.length);
	const baseline = 18;
	const ratio = clamp(baseline / len, 0.62, 1);
	const scaled = baseFontSize * ratio;
	const widthFactor = clamp(maxWidth / 1100, 0.7, 1);
	return scaled * widthFactor;
};

const TitleCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height, durationInFrames} = useVideoConfig();

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

	const settle = interpolate(frame, [titleIn, titleIn + 18], [0.985, 1], {
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

	// Springs for more tactile motion
	const introSpring = spring({
		frame: frame - 2,
		fps,
		config: {damping: 18, stiffness: 140, mass: 0.9},
	});

	const titleSpring = spring({
		frame: frame - titleIn + 2,
		fps,
		config: {damping: 16, stiffness: 170, mass: 0.85},
	});

	const dotPop = spring({
		frame: frame - 6,
		fps,
		config: {damping: 14, stiffness: 260, mass: 0.7},
	});

	const underlineWipe = spring({
		frame: frame - (titleIn + 6),
		fps,
		config: {damping: 16, stiffness: 140, mass: 0.9},
	});

	const microUiSpring = spring({
		frame: frame - 22,
		fps,
		config: {damping: 20, stiffness: 150, mass: 1},
	});

	// Replace global fade-out with a subtle end "lift" + vignette deepen (keeps continuity)
	const endStart = Math.max(0, durationInFrames - 18);
	const endProgress = interpolate(frame, [endStart, durationInFrames - 1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.inOut(Easing.cubic),
	});
	const endLift = interpolate(endProgress, [0, 1], [0, -6]);
	const endVignetteBoost = interpolate(endProgress, [0, 1], [0, 0.18]);

	// Stronger contrast accents
	const accentBlue = "rgba(96,165,250,0.50)";
	const accentPurple = "rgba(167,139,250,0.44)";

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
					background: `radial-gradient(1200px 700px at ${g1x}% 30%, ${accentBlue} 0%, rgba(96,165,250,0.10) 35%, rgba(0,0,0,0) 70%),
radial-gradient(900px 600px at ${g2x}% 55%, ${accentPurple} 0%, rgba(167,139,250,0.09) 40%, rgba(0,0,0,0) 70%),
linear-gradient(180deg, #070A12 0%, #050611 55%, #04040B 100%)`,
					filter: "saturate(1.08) contrast(1.05)",
				}}
			/>

			{/* Subtle grid */}
			<AbsoluteFill
				style={{
					opacity: 0.24,
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
					backgroundSize: "64px 64px",
					backgroundPosition: "center",
					maskImage:
						"radial-gradient(75% 60% at 50% 40%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.22) 65%, rgba(0,0,0,0) 100%)",
					WebkitMaskImage:
						"radial-gradient(75% 60% at 50% 40%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.22) 65%, rgba(0,0,0,0) 100%)",
				}}
			/>

			{/* Vignette */}
			<AbsoluteFill
				style={{
					opacity: clamp(vignetteOpacity + endVignetteBoost, 0, 1),
					background:
						"radial-gradient(1200px 700px at 50% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.74) 100%)",
				}}
			/>

			{/* Content */}
			<AbsoluteFill
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: 80,
					transform: `translateY(${endLift}px)`,
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
							padding: 0,
							borderRadius: 0,
							border: "none",
							background: "transparent",
							backdropFilter: "none",
							WebkitBackdropFilter: "none",
							transform: `translateY(${introY}px) scale(${interpolate(
								introSpring,
								[0, 1],
								[0.98, 1],
							)})`,
							opacity: introOpacity,
						}}
					>
						<span
							style={{
								width: 8,
								height: 8,
								borderRadius: 999,
								background: "linear-gradient(180deg, #60A5FA, #A78BFA)",
								boxShadow:
									"0 0 22px rgba(96,165,250,0.30), 0 0 28px rgba(167,139,250,0.26)",
								transform: `scale(${interpolate(dotPop, [0, 1], [0.7, 1])})`,
							}}
						/>
						<span
							style={{
								color: "rgba(255,255,255,0.92)",
								fontSize: introSize,
								fontWeight: 650,
								letterSpacing: 0.4,
								lineHeight: 1,
								textShadow: "0 10px 30px rgba(0,0,0,0.35)",
							}}
						>
							Introducing
						</span>
					</div>

					{/* Headline */}
					<div style={{height: 18}} />
					<div
						style={{
							transform: `translateY(${titleY}px) scale(${interpolate(
								titleSpring,
								[0, 1],
								[0.985, 1],
							)})`,
							opacity: titleOpacity,
						}}
					>
						<div
							style={{
								fontSize: titleSize,
								fontWeight: 850,
								letterSpacing: -1.25,
								lineHeight: 1.05,
								color: "white",
								textShadow:
									"0 18px 60px rgba(0,0,0,0.55), 0 6px 18px rgba(0,0,0,0.35)",
								margin: 0,
							}}
						>
							<span
								style={{
									background:
										"linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 35%, rgba(255,255,255,0.90) 65%, rgba(255,255,255,0.98) 100%)",
									WebkitBackgroundClip: "text",
									backgroundClip: "text",
									color: "transparent",
								}}
							>
								The AI Workflow Builder
							</span>
						</div>

						{/* Accent underline (wipe in) */}
						<div
							style={{
								margin: "18px auto 0",
								height: 4,
								width: Math.min(maxTextWidth * 0.52, 520),
								borderRadius: 999,
								background:
									"linear-gradient(90deg, rgba(96,165,250,0) 0%, rgba(96,165,250,0.98) 20%, rgba(167,139,250,0.98) 80%, rgba(167,139,250,0) 100%)",
								opacity: 0.92,
								boxShadow: "0 14px 50px rgba(96,165,250,0.22)",
								transformOrigin: "50% 50%",
								transform: `scaleX(${clamp(underlineWipe, 0, 1)})`,
								filter: "saturate(1.08)",
							}}
						/>
					</div>

					{/* Micro UI hint */}
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
								border: "1px solid rgba(255,255,255,0.11)",
								background:
									"linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
								boxShadow:
									"0 34px 90px rgba(0,0,0,0.58), inset 0 1px 0 rgba(255,255,255,0.09)",
								padding: "14px 16px",
								display: "flex",
								alignItems: "center",
								gap: 10,
								backdropFilter: "blur(10px)",
								WebkitBackdropFilter: "blur(10px)",
								transform: `translateY(${interpolate(frame, [22, 40], [12, 0], {
									extrapolateLeft: "clamp",
									extrapolateRight: "clamp",
									easing: Easing.out(Easing.cubic),
								})}px) scale(${interpolate(microUiSpring, [0, 1], [0.99, 1])})`,
							}}
						>
							<div style={{display: "flex", gap: 8}}>
								<div
									style={{
										width: 10,
										height: 10,
										borderRadius: 999,
										background: "rgba(255,99,132,0.95)",
										boxShadow: "0 0 18px rgba(255,99,132,0.18)",
									}}
								/>
								<div
									style={{
										width: 10,
										height: 10,
										borderRadius: 999,
										background: "rgba(255,205,86,0.95)",
										boxShadow: "0 0 18px rgba(255,205,86,0.14)",
									}}
								/>
								<div
									style={{
										width: 10,
										height: 10,
										borderRadius: 999,
										background: "rgba(75,192,192,0.95)",
										boxShadow: "0 0 18px rgba(75,192,192,0.14)",
									}}
								/>
							</div>
							<div style={{flex: 1, display: "flex", gap: 10, alignItems: "center"}}>
								<div
									style={{
										height: 10,
										width: "22%",
										borderRadius: 999,
										background: "rgba(255,255,255,0.12)",
									}}
								/>
								<div
									style={{
										height: 10,
										width: "34%",
										borderRadius: 999,
										background: "rgba(96,165,250,0.26)",
									}}
								/>
								<div
									style={{
										height: 10,
										width: "18%",
										borderRadius: 999,
										background: "rgba(167,139,250,0.24)",
									}}
								/>
							</div>
							<div
								style={{
									padding: "8px 10px",
									borderRadius: 12,
									border: "1px solid rgba(255,255,255,0.13)",
									background: "rgba(255,255,255,0.05)",
									color: "rgba(255,255,255,0.90)",
									fontSize: 14,
									fontWeight: 650,
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