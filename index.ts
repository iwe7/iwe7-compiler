import "reflect-metadata";
import { compile } from 'handlebars';
import { ReflectiveInjector } from '@angular/core';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, } from 'path';
import { resolve } from '@angular-devkit/core/node';
import { of, from, throwError } from 'rxjs';
import { filter, switchMap, tap, take, map } from 'rxjs/operators';
import { listDir } from 'list-dir-file';

export const TemplateMetadata = '__template_metadata__';

const _map: Map<any, any> = new Map();

export interface TemplateOptions {
    input: string;
    output: string;
}

export function Injectable() {
    return (target: any) => {
        if (_map.has(target)) {
            console.log('已存在类', target);
        } else {
            _map.set(target, target);
        }
    }
}

export function Template(templateOption: TemplateOptions) {
    return (target: any) => {
        Reflect.defineMetadata(TemplateMetadata, templateOption, target)
    }
}

export function iwe7Compiler(source: string, options: any) {
    const template = compile(source);
    const tmpl = template(options);
    return tmpl;
}

export const rejector = (): ReflectiveInjector => {
    const classes = [];
    _map.forEach(m => {
        classes.push(m);
    });
    return ReflectiveInjector.resolveAndCreate(classes);
}

export function compilerTemplate(name: string, outputPath: string) {
    const names = name.split('#');
    let stop = true;
    return of(null).pipe(
        filter(() => names.length === 2),
        switchMap(res => {
            return listDir(process.cwd()).pipe(
                filter(res => /node_modules$/.test(res)),
                // 获取第一个匹配的
                take(1),
                map(res => {
                    try {
                        return resolve(names[0], {
                            basedir: res
                        });
                    } catch (err) {
                        throwError(err)
                    }
                }),
                filter(res => existsSync(res)),
                switchMap(res => {
                    const rootPath = dirname(res);
                    return from(import(res)).pipe(
                        map(res => res[names[1]]),
                        tap(obj => {
                            const options = Reflect.getMetadata(TemplateMetadata, obj);
                            const input = options.input;
                            const content = readFileSync(join(rootPath, input)).toString('utf-8');
                            const result = iwe7Compiler(content, rejector().get(obj));
                            writeFileSync(join(outputPath, options.output), result)
                        })
                    );
                }),
                tap(res => console.log(res))
            )
        })
    );
}
