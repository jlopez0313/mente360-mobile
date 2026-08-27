export default interface DiaGuiadoProgreso {
  id?: number;
  date: string;
  completedSteps: number[];
  isCompleted: boolean;
  musicClipId?: number;
}
