export default class PortPin {
    portIndex: number;
    pinIndex: number;

    constructor(port: number, pin: number) {
        this.portIndex = port;
        this.pinIndex = pin;
    }

    isEqual(other: PortPin): boolean {
        return this.pinIndex == other.pinIndex && this.portIndex == other.portIndex;
    }
}