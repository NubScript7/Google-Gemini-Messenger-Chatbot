declare class Net {
    url: string;
    nickname: string;
    output: string;
    constructor();
    set_url(url: string): void;
    set_name(name: string): void;
    set_output(output: string): void;
}
export default Net;
