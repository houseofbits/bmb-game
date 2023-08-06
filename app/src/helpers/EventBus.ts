class EventBus {
    events: {[name: string]: Array<CallableFunction>} = {};

    on(eventName: string, fn: CallableFunction): void {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    }

    off(eventName: string, fn: CallableFunction): void {
        if (this.events[eventName]) {
            for (let i: number = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    }

    trigger(eventName: string, ...data: any) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function(fn) {
                fn(...data);
            });
        }
    }
}

const eventBus = new EventBus();

export default () => {
    return eventBus;
};
