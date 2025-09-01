import { createFileRoute } from '@tanstack/react-router';
import { URLForm } from '../components/URLForm';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div>
      <URLForm />
    </div>
  );
}
