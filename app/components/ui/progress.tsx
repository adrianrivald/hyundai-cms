import * as React from 'react';
import { Fragment } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: 'determinate' | 'indeterminate';
  }
>(({ variant, className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      'bg-secondary relative h-4 w-full overflow-hidden rounded-full',
      className,
    )}
    {...props}
  >
    {variant === 'determinate' ? (
      <ProgressPrimitive.Indicator
        className="bg-green-500 h-full rounded-full transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    ) : (
      <Fragment>
        <ProgressPrimitive.Indicator
          className={`bg-green-500 animate-indeterminate1 absolute inset-y-0 left-0 rounded-full`}
        />
        <ProgressPrimitive.Indicator
          className={`bg-green-500 animate-indeterminate2 absolute inset-y-0 left-0 rounded-full`}
        />
      </Fragment>
    )}
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
