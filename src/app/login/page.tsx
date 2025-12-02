import { Suspense } from 'react';
import LoginClient from './LoginClient';

export default function LoginPage() {
  return (
    <main>
      <h1 className="sr-only">Login</h1>
      <Suspense fallback={<div>Loading login...</div>}>
        <LoginClient />
      </Suspense>
    </main>
  );
}
