import { createFileRoute } from '@tanstack/react-router';
import { URLForm } from '../components/URLForm';
import { LinksTable } from '../components/LinksTable';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div>
      <URLForm />
      <LinksTable />
    </div>
  );
}
