import { cn } from './utils';

export function Button({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-cyan-500 text-zinc-950 hover:bg-cyan-400',
    outline: 'border border-zinc-700 text-zinc-100 hover:bg-zinc-800',
    ghost: 'text-zinc-300 hover:bg-zinc-800',
    danger: 'bg-red-600 text-white hover:bg-red-500'
  };
  return <button className={cn('rounded-xl px-4 py-2 text-sm font-medium transition', variants[variant], className)} {...props} />;
}
