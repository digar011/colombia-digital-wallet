import { LoadingSpinner } from '@/components/ui';

export default function CitizenLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  );
}
