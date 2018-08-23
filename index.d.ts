import "reflect-metadata";
import { ReflectiveInjector } from '@angular/core';
export declare const TemplateMetadata = "__template_metadata__";
export declare class Input extends Map<string, string> {
    constructor();
}
export declare class Option extends Map<string, string> {
    constructor();
}
export declare function registerInput(input: Map<string, string>): void;
export declare function registerOption(option: Map<string, string>): void;
export interface TemplateOptions {
    input: string;
    output: string;
}
export declare function Injectable(): (target: any) => void;
export declare function Template(templateOption: TemplateOptions): (target: any) => void;
export declare function iwe7Compiler(source: string, options: any): any;
export declare const rejector: () => ReflectiveInjector;
export declare function compilerTemplate(name: string, outputPath: string): import("rxjs/internal/Observable").Observable<any>;
