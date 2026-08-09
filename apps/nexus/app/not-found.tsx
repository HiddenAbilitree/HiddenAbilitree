import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex h-screen flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="text-9xl">404</h1>
        <p className="text-2xl">Page not found</p>
      </div>
      <Link
        className="border-tns-blue bg-tns-blue text-tns-black rounded-full border-5 px-9 py-2"
        href="/"
      >
        Return to safety
      </Link>
    </section>
  );
}
