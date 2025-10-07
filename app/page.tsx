import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button>Click med </Button>
      <div className="bg-primary-900 text-white">진한 보라색 배경</div>
      <div className="bg-sub-green">초록색 배경</div>
      <div className="hologram w-64 h-64 rounded-full"></div>
      <div className="point-gradient w-64 h-64 rounded-full"></div>
    </div>
  );
}
