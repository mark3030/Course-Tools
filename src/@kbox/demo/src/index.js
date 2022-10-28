export const add = (x, y) => x + y;

export const subtract = (x, y) => x - y;

export class Demo {
    constructor(type) {
        this.type = type;
    }

    log() {
        console.log("log", this.type);
    }

    demo() {
        console.log("demo");
    }
}