// import GithubActivity from "@/components/GithubActivity";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
  return (
    <main className="bg-background min-h-screen px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-2xl font-bold">DevPulse</h1>
            <p className="text-muted text-sm">
              Your developer activity dashboard
            </p>
          </div>
          <ThemeToggle />
        </div>
        {/* <GithubActivity /> */}
      </div>
    </main>
  );
}
