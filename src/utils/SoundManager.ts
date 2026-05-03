export class SoundManager {
  private static instance: SoundManager;
  private enabled: boolean = true;

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public playLevelUp() {
    // Placeholder
  }

  public playExtraction() {
    // Placeholder
  }

  public playHit() {
    // Placeholder
  }

  public play(_soundName: string) {
    if (!this.enabled) return;
  }
}

export const soundManager = SoundManager.getInstance();
