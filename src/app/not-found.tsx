import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-px flex flex-col items-center py-24 text-center">
      <h1 className="font-display text-6xl font-extrabold text-white">404</h1>
      <p className="mt-2 text-muted">This page could not be found.</p>
      <Link href="/" className="btn-primary mt-6">Go Home</Link>
    </div>
  );
}
