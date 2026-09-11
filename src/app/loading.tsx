import { KineticTextLoader } from "@/components/ui/kinetic-text-loader";

export default function Loading() {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#090807]"><KineticTextLoader /></div>;
}
