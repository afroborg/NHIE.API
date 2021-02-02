export interface IQuestion {
  title: string;
  dateAdded: Date;
  timesUsed: number;
  id?: string;
}

export interface IQuestionForPlay {
  title: string;
  id: string;
}
