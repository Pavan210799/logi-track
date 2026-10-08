// Small label with a value under it
function InfoItem({ label, children }) {
  return (
    <div className="min-w-0">
      <p className="text-[0.68rem] font-semibold tracking-wide text-gray-400 uppercase">{label}</p>
      <div className="mt-0.5 truncate text-[0.85rem] font-semibold text-gray-800">{children}</div>
    </div>
  )
}

export default InfoItem
