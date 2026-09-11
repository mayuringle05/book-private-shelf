function words(value: string) { return value.trim().match(/[\p{L}\p{N}’'-]+/gu)?.length ?? 0; }
function collect(value: unknown, key?: string): number {
  if (typeof value === "string") { if (key === "title" || key === "heading") return 0; return words(value); }
  if (Array.isArray(value)) return value.reduce((sum,item)=>sum+collect(item),0);
  if (value && typeof value === "object") return Object.entries(value as Record<string,unknown>).filter(([k])=>k!=="word_count"&&k!=="chapter_number").reduce((sum,[k,v])=>sum+collect(v,k),0);
  return 0;
}
export function recomputeWordCount(content: Record<string, unknown>) { return collect(content); }
