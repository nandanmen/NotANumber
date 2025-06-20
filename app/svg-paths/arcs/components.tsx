'use client'

import React from "react";
import { CommandText } from "../components/command-list";
import { Button } from "../components/button";
import { animate } from "popmotion";
import { Slider } from "../components/slider";
import { useStateContext } from "./state";

export function RotationSlider() {
    const {
        data: { path },
        set,
    } = useStateContext("rotation");
    const arc = path.atAbsolute<"A">(1);
    return (
        <Slider
            value={[arc.xAxisRotation]}
            onValueChange={([rotation]) => {
                set({ path: path.set(1, { xAxisRotation: rotation }) });
            }}
            step={0.5}
        />
    );
}

export function ToggleFlagButton({ prop }: { prop: "largeArc" | "sweep" }) {
    const {
        data: { path },
        set,
    } = useStateContext("flags");
    return (
        <div className="flex justify-between gap-2">
            <div className="bg-gray1 py-2 px-3 border border-gray8 rounded-md w-full relative">
                <code className="flex gap-[1ch]">
                    <span>A</span>
                    <CommandText command={path.at(1)} index={1} active={[`1.${prop}`]} />
                </code>
            </div>
            <Button
                className="shrink-0"
                onClick={() => {
                    set({
                        path: path.set(1, { [prop]: !path.atAbsolute<"A">(1)[prop] }),
                    });
                }}
            >
                Toggle
            </Button>
        </div>
    );
}

export function ShrinkArcButton() {
    const {
        data: { path },
        set,
    } = useStateContext("small-ellipse");
    return (
        <div className="flex justify-between gap-2">
            <div className="bg-gray1 py-2 px-3 border border-gray8 rounded-md w-full relative">
                <code className="flex gap-[1ch]">
                    <span>A</span>
                    <CommandText command={path.at(1)} index={1} active={["1.rx"]} />
                </code>
                <button
                    className="absolute right-1 top-1 bottom-1 p-1 rounded-md flex items-center hover:bg-gray6"
                    onClick={() => {
                        set({ path: path.set(1, { rx: 10 }) });
                    }}
                >
                    <Undo />
                </button>
            </div>
            <Button
                className="shrink-0"
                onClick={() => {
                    animate({
                        from: 10,
                        to: 6.5,
                        type: "spring",
                        duration: 3000,
                        onUpdate: (rx) => {
                            set({ path: path.set(1, { rx }) });
                        },
                    });
                }}
            >
                Shrink Arc
            </Button>
        </div>
    );
}

const Undo = () => {
    return (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <g
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
            >
                <path d="M9.25 4.75L4.75 9L9.25 13.25" />
                <path d="M5.5 9H15.25C17.4591 9 19.25 10.7909 19.25 13V19.25" />
            </g>
        </svg>
    );
};
