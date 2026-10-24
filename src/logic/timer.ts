export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const remainderSeconds = (safeSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainderSeconds}`;
}

export interface IGameTimerOptions {
  onTick: (timeLeft: number) => void;
  onTimeUp: () => void;
}

export class GameTimer {
  private endTime: number = 0;
  private intervalId: number | null = null;
  private isRunning: boolean = false;
  private readonly options: IGameTimerOptions;

  constructor(options: IGameTimerOptions) {
    this.options = options;
  }

  public start(seconds: number): void {
    this.stop();
    this.endTime = Date.now() + Math.max(0, seconds) * 1000;
    this.isRunning = true;
    this.scheduleInterval();
    this.tick();
  }

  public setTime(seconds: number): void {
    this.endTime = Date.now() + Math.max(0, seconds) * 1000;
  }

  public getTimeLeft(): number {
    if (!this.isRunning) return 0;
    const remainingMs = Math.max(0, this.endTime - Date.now());
    return Math.ceil(remainingMs / 1000);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public get running(): boolean {
    return this.isRunning;
  }

  public tick(): void {
    if (!this.isRunning) return;

    const remainingMs = this.endTime - Date.now();
    if (remainingMs <= 0) {
      this.stop();
      this.options.onTick(0);
      this.options.onTimeUp();
      return;
    }

    const remainingSec = Math.ceil(remainingMs / 1000);
    this.options.onTick(remainingSec);
  }

  private scheduleInterval(): void {
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 250);
  }
}
