import moment, { Moment } from "moment";
import Value from "./value";

const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss.SSSS";

class Timestamp implements Value {
    private readonly stamp: Moment;

    constructor(stamp: number) {
        this.stamp = moment(stamp);
    }

    public toString(): string {
        return this.stamp.format(TIME_FORMAT);
    }

    public toStamp(): number {
        return this.stamp.valueOf();
    }
}

export const generateTimestamp = (): Timestamp => new Timestamp(Date.now());

export const stringToTimestamp = (format: string): Timestamp => new Timestamp(moment(format, TIME_FORMAT).valueOf());

export default Timestamp;
