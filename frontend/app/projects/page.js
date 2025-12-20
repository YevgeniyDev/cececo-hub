import ProjectListClient from "../components/ProjectListClient";

export default function ProjectsPage() {
  return (
    <ProjectListClient
      defaultKind="project"
      title="Projects"
      subtitle="Registry of clean-energy projects across CECECO member countries."
    />
  );
}
