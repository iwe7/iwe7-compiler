import "reflect-metadata";
import { compile } from 'handlebars';
import { ReflectiveInjector, Provider } from '@angular/core';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, } from 'path';
import { resolve } from '@angular-devkit/core/node';
import { of, from, throwError } from 'rxjs';
import { filter, switchMap, tap, take, map } from 'rxjs/operators';
import { listDir } from 'list-dir-file';
import { logging, terminal } from '@angular-devkit/core';
export const TemplateMetadata = '__template_metadata__';

const _map: Map<any, Provider> = new Map();
interface KeyValue {
    [key: string]: string;
}
@Injectable()
export class Input extends Map<string, string> {
    constructor() {
        super();
    }
}

@Injectable()
export class Option extends Map<string, string> {
    constructor() {
        super();
    }
}

export function registerInput(input: Map<string, string>) {
    _map.set(Input, {
        provide: Input,
        useValue: input
    })
}

export function registerOption(option: Map<string, string>) {
    _map.set(Option, {
        provide: Option,
        useValue: option
    })
}

export interface TemplateOptions {
    input: string;
    output: string;
}

export function Injectable() {
    return (target: any) => {
        _map.set(target, target);
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
    _map.forEach((m: Provider) => {
        classes.push(m);
    });
    return ReflectiveInjector.resolveAndCreate(classes);
}

export function compilerTemplate(name: string, outputPath: string) {
    const names = name.split('#');
    const logger = new logging.IndentLogger('compiler');
    logger.subscribe(res => console.log(`${terminal.green(res.message)}`))
    return of(null).pipe(
        filter(() => names.length === 2),
        switchMap(res => {
            return listDir(process.cwd()).pipe(
                filter(res => /node_modules$/.test(res)),
                // 获取第一个匹配的
                take(1),
                map(res => {
                    logger.info(`find root ${res}`);
                    try {
                        logger.info(`resolve file name ${names[0]}`);
                        logger.info(`resolve export ${names[1]}`);
                        return resolve(names[0], {
                            basedir: res,
                            checkLocal: true,
                            checkGlobal: true,
                            preserveSymlinks: true
                        });
                    } catch (err) {
                        throwError(err)
                    }
                }),
                filter(res => {
                    const exit = existsSync(res);
                    if (!exit) {
                        logger.info(`file not exist ${res}`);
                    }
                    return existsSync(res);
                }),
                switchMap(res => {
                    const rootPath = dirname(res);
                    logger.info(`start compiler ${rootPath}`);
                    return from(import(res)).pipe(
                        map(res => res[names[1]]),
                        tap(obj => {
                            const options = Reflect.getMetadata(TemplateMetadata, obj);
                            const input = options.input;
                            const content = readFileSync(join(rootPath, input)).toString('utf-8');
                            const result = iwe7Compiler(content, rejector().get(obj));
                            writeFileSync(join(outputPath, options.output), result)
                            logger.info(`start file ${join(outputPath, options.output)}`);
                        })
                    );
                })
            )
        })
    );
}
