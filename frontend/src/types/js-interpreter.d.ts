declare module 'js-interpreter' {
  export default class JSInterpreter {
    constructor(code: string, initFunc?: (interpreter: JSInterpreter, globalObject: any) => void);
    
    step(): boolean;
    getState(): {
      node?: {
        loc?: {
          start?: {
            line?: number;
            column?: number;
          };
        };
      };
    } | null;
    getScope(): any;
    
    globalScope: any;
    OBJECT_PROTO: any;
    
    setProperty(obj: any, name: string, value: any): void;
    getProperty(obj: any, name: string): any;
    nativeToNative(value: any): any;
    nativeToPseudo(value: any): any;
    pseudoToNative(value: any): any;
    createObject(proto: any): any;
    createObjectProto(proto: any): any;
    createNativeFunction(func: (...args: any[]) => any): any;
  }
}

declare global {
  interface Window {
    monaco: any;
  }
}

export {};
