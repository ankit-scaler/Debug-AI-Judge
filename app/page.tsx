import { redirect } from 'next/navigation';

// Phase 2a ships one question. The question list arrives with phase 2b.
export default function Home() {
  redirect('/q/flipkart-cart');
}
