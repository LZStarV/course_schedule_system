type PhaseInfo = {
  total: number;
  start: number;
  lastPct: number;
};

export class ProgressReporter {
  private phases: Record<string, PhaseInfo> = {};
  private isTTY: boolean = process.stdout.isTTY === true;
  private width: number = 32;
  private logger: any;

  constructor(logger: any) {
    this.logger = logger;
  }

  update(phase: string, done: number, total: number) {
    if (!this.phases[phase]) {
      this.phases[phase] = {
        total,
        start: Date.now(),
        lastPct: -1,
      };
    } else {
      this.phases[phase].total = total;
    }
    const info = this.phases[phase];
    const pct = Math.max(
      0,
      Math.min(
        100,
        Math.floor((done / Math.max(1, total)) * 100)
      )
    );
    if (pct === info.lastPct) return;
    info.lastPct = pct;
    if (this.isTTY) {
      const filled = Math.floor((pct / 100) * this.width);
      const bar = `${'█'.repeat(filled)}${'░'.repeat(Math.max(0, this.width - filled))}`;
      const elapsed = Math.max(0, Date.now() - info.start);
      const rate = done > 0 ? elapsed / done : 0;
      const remain =
        total > done
          ? Math.floor((total - done) * rate)
          : 0;
      const eta = this.formatMs(remain);
      const line = `[${phase}] ${bar} ${pct}% (${done}/${total}) ETA ${eta}`;
      process.stdout.write(`\r${line}`);
      if (pct === 100) process.stdout.write('\n');
    } else {
      this.logger.info(
        { phase, done, total, pct },
        'progress'
      );
    }
  }

  private formatMs(ms: number) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const ss = s % 60;
    const mm = m % 60;
    if (h > 0) return `${h}h${mm}m${ss}s`;
    if (m > 0) return `${mm}m${ss}s`;
    return `${ss}s`;
  }
}
