import { getBookBySlug, getBookUnits, getUnitByKey } from "@/lib/repository";

export async function getPublishedReaderUnit(slug: string, unitKey: string) {
  const book = await getBookBySlug(slug);
  if (!book || book.status !== "published") return null;
  const unit = await getUnitByKey(book.id, unitKey);
  if (!unit || unit.status !== "complete") return null;
  const all = (await getBookUnits(book.id, true)).filter((item) => item.unit_type === "chapter");
  const index = all.findIndex((item) => item.id === unit.id);
  return { book, unit, previous:index>0?all[index-1]:null, next:index>=0&&index<all.length-1?all[index+1]:null, chapterIndex:Math.max(index,0), chapterCount:all.length };
}
