import { ErrorBoundaryWrapper } from '@/components/ErrorBoundary';
import { LinksTable } from '@/components/LinksTable';
import { URLForm } from '@/components/URL_Form';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => {
    const rawPage = Number(search.page);
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
    const term = typeof search.term === 'string' && search.term.trim().length > 0 ? search.term.trim() : undefined;
    const tag = typeof search.tag === 'string' && search.tag.trim().length > 0 ? search.tag.trim() : undefined;
    return { page, term, tag } satisfies {
      page: number;
      term?: string;
      tag?: string;
    };
  },
  component: RouteComponent,
});
console.log({ env: import.meta.env });

function RouteComponent() {
  return (
    <main>
      <ErrorBoundaryWrapper>
        <URLForm />
      </ErrorBoundaryWrapper>
      <ErrorBoundaryWrapper>
        <LinksTable />
      </ErrorBoundaryWrapper>
      <footer className="w-full max-w-5xl mx-auto my-6 flex justify-end">
        <span className="text-xs italic text-muted-foreground">build: {import.meta.env.VERCEL_DEPLOYMENT_ID ?? 'local'}</span>
      </footer>
    </main>
  );
}
