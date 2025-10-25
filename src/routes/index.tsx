import { ErrorBoundaryWrapper } from '@/components/ErrorBoundary';
import { LinksTable } from '@/components/LinksTable';
import { URLForm } from '@/components/URL_Form';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
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
