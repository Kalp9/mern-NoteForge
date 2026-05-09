import { NotebookPen } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <main className="min-h-screen bg-base-200 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-base-content/10 bg-base-100 shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <section className="hidden bg-neutral p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="flex items-center gap-3 text-primary">
              <div className="rounded-md bg-primary/15 p-3">
                <NotebookPen className="size-7" />
              </div>
              <span className="text-2xl font-bold">NoteForge</span>
            </div>

            <div className="space-y-5">
              <p className="text-4xl font-bold leading-tight text-neutral-content">
                Private notes for focused builders.
              </p>
              <p className="max-w-md text-base text-neutral-content/70">
                Keep ideas, plans, and drafts organized in a workspace only you
                can access.
              </p>
            </div>

            <div className="h-2 w-32 rounded-full bg-primary" />
          </section>

          <section className="p-6 sm:p-10">
            <div className="mb-8 lg:hidden">
              <div className="mb-4 flex items-center gap-3 text-primary">
                <NotebookPen className="size-7" />
                <span className="text-2xl font-bold">NoteForge</span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-base-content">{title}</h1>
              <p className="mt-2 text-base-content/70">{subtitle}</p>
            </div>

            {children}
          </section>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
