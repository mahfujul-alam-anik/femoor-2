import { cn } from './utils';

export function Input(props) {
  return <input className={cn('w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-cyan-400 focus:outline-none')} {...props} />;
}
