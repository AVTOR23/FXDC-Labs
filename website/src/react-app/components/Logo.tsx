import { cn } from '@/react-app/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="FXDC Labs"
      className={cn('h-10 w-10 object-contain', className)}
    />
  );
}
