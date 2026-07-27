/** A single "year / title / description" row, divided by a bottom border —
 * used for exhibition history, awards, and similar dated lists. */
export default function YearRow({ year, title, description }: { year: string; title: string; description: string }) {
  return (
    <div className="flex gap-4 items-start py-4 border-b border-[rgba(15,16,14,0.24)] w-full text-[18px] tracking-[-0.36px] leading-[1.5]">
      <p className="font-bold text-[#bb9a6d] w-[70px] shrink-0">{year}</p>
      <div className="flex flex-col md:flex-row flex-1 gap-1 md:gap-6 min-w-0">
        <p className="md:flex-1 min-w-0 font-medium text-[#0f100e]">{title}</p>
        <p className="md:flex-1 min-w-0 font-normal text-[rgba(15,16,14,0.56)]">{description}</p>
      </div>
    </div>
  );
}
