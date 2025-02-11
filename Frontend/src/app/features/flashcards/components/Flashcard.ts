export class Flashcard {
    constructor(
      public id: number,
      public frontView: string,
      public backView: string,
      public isToggled: boolean = false // Default to not flipped
    ) {}
  }