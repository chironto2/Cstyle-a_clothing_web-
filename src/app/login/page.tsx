// src/app/login/page.tsx
import dynamic from 'next/dynamic';

// Client-only component
const LoginClient = dynamic(() => import('./LoginClient'), { ssr: false });

export default function LoginPage() {
  return (
    <main>
      <h1 className="sr-only">Login</h1>
      <LoginClient />
    </main>
  );
}
