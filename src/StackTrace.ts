export interface StackTrace {
    timestamp: string;
    name: string;
    input: string;
    output: string;
    duration: number;
    children: [StackTrace];
}