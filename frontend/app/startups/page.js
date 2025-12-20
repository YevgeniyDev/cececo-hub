import ProjectListClient from "../components/ProjectListClient";

export default function StartupsPage() {
  return (
    <ProjectListClient
      defaultKind="startup"
      title="Startups"
      subtitle="Startups in the CECECO clean-energy ecosystem (MVP sample data)."
    />
  );
}
