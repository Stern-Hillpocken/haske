export class PopupModel {
    constructor(
        public status: "error" | "info",
        public content: string
    ) {}
}