import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found | Esnaad</title>
        <meta name="description" content="The page you are looking for could not be found." />
        <meta name="robots" content="noindex, follow" />
      </head>
      <body className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-center text-white">
        <div className="space-y-6">
          <h1 className="text-8xl font-bold text-amber-500">404</h1>
          <h2 className="text-2xl font-semibold">
            Page Not Found
          </h2>
          <p className="max-w-md text-gray-400">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/en"
              className="inline-flex items-center justify-center rounded-md bg-amber-500 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-amber-400"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
