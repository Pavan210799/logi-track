// White card with an icon and title, used by charts and lists
function DashboardPanel({ icon, iconStyle, title, subtitle, children }) {
  const iconClasses = iconStyle || 'bg-sand-dark text-accent'

  return (
    <section className="flex h-full flex-col rounded-2xl border border-line-soft bg-surface p-4.5 shadow-card">
      <header className="mb-4 flex items-center gap-3 border-b border-line pb-3.5">
        <div className={'grid h-10 w-10 shrink-0 place-items-center rounded-xl ' + iconClasses}>{icon}</div>
        <div>
          <h2 className="text-base font-bold">{title}</h2>
          <p className="mt-1 text-[0.8rem] text-gray-500">{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  )
}

export default DashboardPanel
