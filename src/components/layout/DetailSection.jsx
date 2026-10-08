// Titled block used inside the details popups
function DetailSection({ title, icon, extra, children }) {
  return (
    <section className="mt-5 first:mt-0">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-[0.8rem] font-bold tracking-wide text-accent uppercase">
          {icon}
          {title}
        </h3>
        {extra && <span className="text-xs font-semibold text-gray-500">{extra}</span>}
      </div>
      {children}
    </section>
  )
}

export default DetailSection
