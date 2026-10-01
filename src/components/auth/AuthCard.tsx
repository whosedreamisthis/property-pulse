interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md rounded-xl border border-gray-300 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-primary-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <div className="mt-6 grid gap-6">{children}</div>
        <p className="mt-6 text-center text-sm text-gray-700">{footer}</p>
      </div>
    </main>
  );
}
