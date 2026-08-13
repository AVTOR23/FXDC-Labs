import { cn } from '@/react-app/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="FXDC Academy"
      className={cn('h-10 w-10 rounded-lg object-cover', className)}
    />
  );
}
