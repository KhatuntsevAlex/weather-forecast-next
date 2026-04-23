interface DetailItemProps {
  icon: string;
  label: string;
  value: string;
  time?: string;
}

export function DetailItem({ icon, label, value, time }: DetailItemProps) {
  return (
    <div className="bg-surface hover:bg-surface-hover grid min-w-0 cursor-default grid-cols-[auto_1fr] items-center gap-x-2 rounded-lg border border-transparent p-2.5 transition-colors duration-150 hover:border-cyan-500 sm:p-3">
      <dt className="contents">
        <span className="row-span-2 shrink-0 self-center text-lg" aria-hidden="true">
          {icon}
        </span>
        <span className="text-muted-foreground min-w-0 truncate text-xs">{label}</span>
      </dt>
      <dd className="text-foreground m-0 min-w-0 truncate text-sm font-medium">
        {time ? <time dateTime={time}>{value}</time> : value}
      </dd>
    </div>
  );
}
