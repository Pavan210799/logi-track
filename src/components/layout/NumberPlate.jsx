// Yellow number plate, like the ones on Indian goods vehicles
function NumberPlate({ number, small }) {
  return (
    <span
      className={
        'inline-flex max-w-full items-stretch overflow-hidden rounded-md border-2 border-gray-950 bg-amber-300 font-mono font-extrabold tracking-wider text-gray-950 shadow-sm ' +
        (small ? 'text-[0.72rem]' : 'text-sm')
      }
    >
      <span className="grid place-items-center bg-blue-700 px-1 text-[0.5rem] font-bold tracking-normal text-white">IND</span>
      <span className={'truncate ' + (small ? 'px-1.5 py-0.5' : 'px-2.5 py-1')}>{number}</span>
    </span>
  )
}

export default NumberPlate
