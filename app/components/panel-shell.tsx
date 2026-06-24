"use client";
import { usePathname } from "next/navigation";
import IntroPanel from "./intro-panel";
import ProjectsPanel from "./projects-panel";
import Particles from "./particles";
import PanelTest from "./pan";

export default function PanelShell() {
  const pathname = usePathname();

  const isHero     = !pathname || pathname === "/";
  const isProjects = !isHero && pathname.startsWith("/projects");
  const slug       = isProjects && pathname !== "/projects"
    ? pathname.slice("/projects/".length)
    : null;

  return (
    <>
      <Particles
        className="fixed inset-0 pointer-events-none"
        quantity={100}
      />
      {
        !isHero && (<PanelTest/>)
      }
      {/*
      {!isHero && (
        <>
          <IntroPanel projectsOpen={isProjects} />
          <ProjectsPanel open={isProjects} selectedSlug={slug} />
        </>
      )}
      */}
    </>
  );
}
