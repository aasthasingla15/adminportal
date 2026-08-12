import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RedirectLogin() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/login');
  }, [router]);

  return null;
}
