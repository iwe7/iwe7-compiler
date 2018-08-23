import "reflect-metadata";
import { ReflectiveInjector } from '@angular/core';
export declare const TemplateMetadata = "__template_metadata__";
export interface TemplateOptions {
    input: string;
    output: string;
}
export declare function Injectable(): (target: any) => void;
export declare function Template(templateOption: TemplateOptions): (target: any) => void;
export declare function iwe7Compiler(source: string, options: any): any;
export declare const rejector: () => ReflectiveInjector;
export declare function compilerTemplate(name: string, outputPath: string): import("rxjs/internal/Observable").Observable<any>;
