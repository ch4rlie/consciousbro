export function SecondaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-bone/70 underline-offset-4 hover:text-ember hover:underline">
      {children}
    </a>
  );
}
