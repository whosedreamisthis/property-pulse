import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-primary-500 bg-primary-700">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-white text-primary-700">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="size-6"
            >
              <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 1-1.06 1.06l-.97-.97V19.5a1.5 1.5 0 0 1-1.5 1.5h-3a.75.75 0 0 1-.75-.75V15.5h-3v4.75a.75.75 0 0 1-.75.75h-3a1.5 1.5 0 0 1-1.5-1.5v-6.88l-.97.97a.75.75 0 1 1-1.06-1.06l8.69-8.69Z" />
            </svg>
          </span>
          <span className="text-2xl font-bold text-white">PropertyPulse</span>
        </Link>

        <button
          type="button"
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
        >
          Sign In
        </button>
      </nav>
    </header>
  );
}
