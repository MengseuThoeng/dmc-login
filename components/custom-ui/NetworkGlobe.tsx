/**
 * NetworkGlobe.tsx
 *
 * A rotating wireframe "network globe" — a sphere built from nodes and
 * connecting edges, with labeled feature badges floating around its
 * surface and a pulsing icon at the center. Themed gold-on-navy to
 * match the teamwork honeycomb reference.
 *
 * ── Install ──────────────────────────────────────────────────────────
 *   npm install three @react-three/fiber @react-three/drei lucide-react
 *
 * ── Usage ────────────────────────────────────────────────────────────
 *   import NetworkGlobe from "./NetworkGlobe";
 *
 *   <div style={{ width: "100%", height: "650px" }}>
 *     <NetworkGlobe />
 *   </div>
 */
'use client'


import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import {
    Eye,
    Users,
    Lightbulb,
    Flame,
    Map,
    Handshake,
    Target,
    BarChart3,
    RefreshCw,
    UsersRound,
    Briefcase,
    TrendingUp,
    Zap,
    ThumbsUp,
    Compass,
    UserPlus,
    GraduationCap,
    Link2,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────

interface FeatureNode {
    label: string;
    icon: React.ReactNode;
    azimuth: number;
    elevation: number;
    arrow?: boolean;
}

// ── Config ───────────────────────────────────────────────────────────

const RADIUS = 3.2;
const NODE_COUNT = 160;
const EDGE_DISTANCE = 1.35;
const ACCENT = "#d4a537"; // gold
const ACCENT_DIM = "#d4a537";
const BG = "rgba(20,43,94,0)"; // deep navy

const FEATURES: FeatureNode[] = [
    {
    label: "VISION",
    icon: (
      <video
        src="images/gif/happy1.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "30px",
          height: "60px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 0,
    elevation: 12
  },
  {
    label: "VISION PRODUCTIVITY",
    icon: (
      <video
        src="images/gif/ek.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "35px",
          height: "60px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 120,
    elevation: 40
  },
  {
    label: "ACTION PROCESS",
    icon: (
      <video
        src="images/gif/somrach1.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "40px",
          height: "40px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 240,
    elevation: 80
  },
  {
    label: "TOGETHER SUCCESS",
    icon: (
      <video
        src="images/gif/happy.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "40px",
          height: "60px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 30,
    elevation: 45
  },
  {
    label: "SUPPORT PERFORMANCE",
    icon: (
      <video
        src="images/gif/chet1.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "40px",
          height: "40px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 150,
    elevation: 45
  },
  {
    label: "LEADER ACTION",
    icon: (
      <video
        src="images/gif/vandy5.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "35px",
          height: "45px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 270,
    elevation: 45
  },
  {
    label: "PROJECT CREATIVITY",
    icon: (
      <video
        src="images/gif/alex2.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "40px",
          height: "60px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 60,
    elevation: 15
  },
  {
    label: "MOTIVATION TRAINING",
    icon: (
      <video
        src="images/gif/chet.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "40px",
          height: "60px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 180,
    elevation: 15
  },
  {
    label: "COOPERATION MEMBER",
    icon: (
      <video
        src="images/gif/alexhorng.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "60px",
          height: "40px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 300,
    elevation: 15
  },
  {
    label: "PLANNING LEADERSHIP",
    icon: (
      <video
        src="images/gif/theaalex.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "30px",
          height: "55px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 100,
    elevation: 10
  },
  {
    label: "COLLABORATION PROCESS",
    icon: (
      <video
        src="images/gif/alex1.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "20px",
          height: "50px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: -120,
    elevation: -15
  },
  {
    label: "MEMBER SKILLS",
    icon: (
      <video
        src="images/gif/vandy4.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "40px",
          height: "40px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 240,
    elevation: -45
  },
  {
    label: "GOAL EXPERIENCE",
    icon: (
      <video
        src="images/gif/vandy3.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "30px",
          height: "50px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 30,
    elevation: -45
  },
  {
    label: "ANALYSIS MEMBER",
    icon: (
      <video
        src="images/gif/somrach.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "40px",
          height: "50px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 150,
    elevation: -20
  },
  {
    label: "PARTNER",
    icon: (
      <video
        src="images/gif/vandy2.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "40px",
          height: "60px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 270,
    elevation: -45
  },
  {
    label: "PROCESS FEEDBACK",
    icon: (
      <video
        src="images/gif/piseth.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "40px",
          height: "60px",
          objectFit: "contain",
        }}
      />
    ),
    azimuth: 60,
    elevation: -80
  },

    {
  label: "Ing Sovandy",
  icon: (
    <video
      src="images/gif/vandy.mp4"
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: "40px",
        height: "80px",
        objectFit: "contain",
      }}
    />
  ),
  azimuth: 40,
  elevation: -10
},

{
  label: "Sry Bora",
  icon: (
    <video
      src="images/gif/bora.mp4"
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: "40px",
        height: "40px",
        objectFit: "contain",
      }}
    />
  ),
  azimuth: 180,
  elevation: -50
}
];

// ── Helpers ──────────────────────────────────────────────────────────

function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
    }
    return points;
}

function toXYZ(azimuthDeg: number, elevationDeg: number, radius: number): [number, number, number] {
    const az = (azimuthDeg * Math.PI) / 180;
    const el = (elevationDeg * Math.PI) / 180;
    const x = radius * Math.cos(el) * Math.sin(az);
    const y = radius * Math.sin(el);
    const z = radius * Math.cos(el) * Math.cos(az);
    return [x, y, z];
}

// ── Sphere of nodes + connecting edges ──────────────────────────────

function WireframeSphere() {
    const points = useMemo(() => fibonacciSphere(NODE_COUNT, RADIUS), []);

    const edges = useMemo(() => {
        const segs: [THREE.Vector3, THREE.Vector3][] = [];
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                if (points[i].distanceTo(points[j]) < EDGE_DISTANCE) {
                    segs.push([points[i], points[j]]);
                }
            }
        }
        return segs;
    }, [points]);

    const dotsGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

    return (
        <group>
            {edges.map(([a, b], i) => (
                <Line key={i} points={[a, b]} color={ACCENT_DIM} transparent opacity={0.35} lineWidth={0.6} />
            ))}
            <points geometry={dotsGeometry}>
                <pointsMaterial color={ACCENT} size={0.045} transparent opacity={0.9} sizeAttenuation />
            </points>
        </group>
    );
}

// ── Center pulsing "Teamwork" icon ──────────────────────────────────

function CenterCore() {
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (ringRef.current) {
            const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.08;
            ringRef.current.scale.setScalar(s);
        }
    });

    return (
        <group>
            {/*<mesh ref={ringRef}>*/}
            {/*    <torusGeometry args={[0.42, 0.015, 16, 64]} />*/}
            {/*    <meshBasicMaterial color={ACCENT} transparent opacity={0.5} />*/}
            {/*</mesh>*/}
            <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 10 }}>
                    <div
                        style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(212,165,55,0.12)",
                            border: `1px solid ${ACCENT}`,
                            boxShadow: `0 0 18px ${ACCENT}80`,
                        }}
                    >
                        <Handshake size={18} color={ACCENT} />
                    </div>
                    <span style={{ fontFamily: "serif", fontSize: 11, letterSpacing: 1.5, color: ACCENT }}>DMC</span>
                </div>
            </Html>
        </group>
    );
}

// ── Floating labeled feature badge ──────────────────────────────────

function FeatureBadge({ feature }: { feature: FeatureNode }) {
    const pos = toXYZ(feature.azimuth, feature.elevation, RADIUS + 0.15);

    return (
        <Html position={pos} center distanceFactor={9} style={{ pointerEvents: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 10 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 10px",
                        borderRadius: 5,
                        background: "rgba(136,136,136,0.2)",
                        border: `1px solid ${ACCENT}20`,
                        boxShadow: `0 0 12px ${ACCENT}30`,
                        color: ACCENT,
                    }}
                >
                    {feature.icon}
                    {feature.arrow && <span style={{ opacity: 0.7, fontSize: 12 }}>→</span>}
                </div>
                <span
                    style={{
                        fontFamily: "monospace",
                        fontSize: 9,
                        letterSpacing: 1,
                        color: "#a8c4d8",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                    }}
                >
          {/* {feature.label} */}
        </span>
            </div>
        </Html>
    );
}

// ── Auto-rotating group wrapper ─────────────────────────────────────

function RotatingRig({ children }: { children: React.ReactNode }) {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.08;
    });
    return <group ref={groupRef}>{children}</group>;
}

// ── Scene ────────────────────────────────────────────────────────────

function Scene() {
    return (
        <>
            {/*<ambientLight intensity={10} />*/}
            {/*<pointLight position={[5, 5, 5]} intensity={0.4} color={ACCENT} />*/}
            <RotatingRig>
                <WireframeSphere />
                <CenterCore />
                {FEATURES.map((f) => (
                    <FeatureBadge key={f.label} feature={f} />
                ))}
            </RotatingRig>
        </>
    );
}

// ── Public component

export default function NetworkGlobe() {
    return (
        <div style={{ width: "100%", height: "100%", background: BG, position: "relative" }}>
            <Canvas camera={{ position: [0, 0, 8.5], fov: 55 }}>
                {/*<color attach="background" args={[BG]} />*/}
                <fog attach="fog" args={[BG, 8, 14]} />
                <Scene />
            </Canvas>
        </div>
    );
}