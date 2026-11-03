"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

import {
  setMachineMode,
  useMachineMode,
  useMarkdownHref,
  ViewToggle,
} from "./view-toggle";
import "./machine-view.css";

const MachineLayer = dynamic(
  () => import("./machine-layer").then((module) => module.MachineLayer),
  { ssr: false },
);

export function MachineView() {
  const href = useMarkdownHref();
  const machine = useMachineMode();
  const [opened, setOpened] = useState(false);
  if (machine && !opened) setOpened(true);

  useEffect(() => {
    if (!machine) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMachineMode(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [machine]);

  return (
    <>
      {opened && <MachineLayer />}
      <ViewToggle markdownHref={href} variant="floating" />
    </>
  );
}
