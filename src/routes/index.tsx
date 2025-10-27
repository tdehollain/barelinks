import { ErrorBoundaryWrapper } from '@/components/ErrorBoundary';
import { LinksTable } from '@/components/LinksTable';
import { URLForm } from '@/components/URL_Form';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => {
    const rawPage = Number(search.page);
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
    const term =
      typeof search.term === 'string' && search.term.trim().length > 0
        ? search.term.trim()
        : undefined;
    return { page, term } satisfies { page: number; term?: string };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <ErrorBoundaryWrapper>
        <URLForm />
      </ErrorBoundaryWrapper>
      <ErrorBoundaryWrapper>
        <LinksTable />
      </ErrorBoundaryWrapper>
    </main>
  );
}
