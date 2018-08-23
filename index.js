"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const handlebars_1 = require("handlebars");
const core_1 = require("@angular/core");
const fs_1 = require("fs");
const path_1 = require("path");
const node_1 = require("@angular-devkit/core/node");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const list_dir_file_1 = require("list-dir-file");
const core_2 = require("@angular-devkit/core");
exports.TemplateMetadata = '__template_metadata__';
const _map = new Map();
let Input = class Input extends Map {
    constructor() {
        super();
    }
};
Input = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], Input);
exports.Input = Input;
let Option = class Option extends Map {
    constructor() {
        super();
    }
};
Option = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], Option);
exports.Option = Option;
function registerInput(input) {
    _map.set(Input, {
        provide: Input,
        useValue: input
    });
}
exports.registerInput = registerInput;
function registerOption(option) {
    _map.set(Option, {
        provide: Option,
        useValue: option
    });
}
exports.registerOption = registerOption;
function Injectable() {
    return (target) => {
        _map.set(target, target);
    };
}
exports.Injectable = Injectable;
function Template(templateOption) {
    return (target) => {
        Reflect.defineMetadata(exports.TemplateMetadata, templateOption, target);
    };
}
exports.Template = Template;
function iwe7Compiler(source, options) {
    const template = handlebars_1.compile(source);
    const tmpl = template(options);
    return tmpl;
}
exports.iwe7Compiler = iwe7Compiler;
exports.rejector = () => {
    const classes = [];
    _map.forEach((m) => {
        classes.push(m);
    });
    return core_1.ReflectiveInjector.resolveAndCreate(classes);
};
function compilerTemplate(name, outputPath) {
    const names = name.split('#');
    const logger = new core_2.logging.IndentLogger('compiler');
    logger.subscribe(res => console.log(`${core_2.terminal.green(res.message)}`));
    return rxjs_1.of(null).pipe(operators_1.filter(() => names.length === 2), operators_1.switchMap(res => {
        return list_dir_file_1.listDir(process.cwd()).pipe(operators_1.filter(res => /node_modules$/.test(res)), 
        // 获取第一个匹配的
        operators_1.take(1), operators_1.map(res => {
            logger.info(`find root ${res}`);
            try {
                logger.info(`resolve file name ${names[0]}`);
                logger.info(`resolve export ${names[1]}`);
                return node_1.resolve(names[0], {
                    basedir: res,
                    checkLocal: true,
                    checkGlobal: true,
                    preserveSymlinks: true
                });
            }
            catch (err) {
                rxjs_1.throwError(err);
            }
        }), operators_1.filter(res => {
            const exit = fs_1.existsSync(res);
            if (!exit) {
                logger.info(`file not exist ${res}`);
            }
            return fs_1.existsSync(res);
        }), operators_1.switchMap(res => {
            const rootPath = path_1.dirname(res);
            logger.info(`start compiler ${rootPath}`);
            return rxjs_1.from(Promise.resolve().then(() => require(res))).pipe(operators_1.map(res => res[names[1]]), operators_1.tap(obj => {
                const options = Reflect.getMetadata(exports.TemplateMetadata, obj);
                const input = options.input;
                const content = fs_1.readFileSync(path_1.join(rootPath, input)).toString('utf-8');
                const result = iwe7Compiler(content, exports.rejector().get(obj));
                fs_1.writeFileSync(path_1.join(outputPath, options.output), result);
                logger.info(`start file ${path_1.join(outputPath, options.output)}`);
            }));
        }));
    }));
}
exports.compilerTemplate = compilerTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNEJBQTBCO0FBQzFCLDJDQUFxQztBQUNyQyx3Q0FBNkQ7QUFDN0QsMkJBQTZEO0FBQzdELCtCQUFzQztBQUN0QyxvREFBb0Q7QUFDcEQsK0JBQTRDO0FBQzVDLDhDQUFtRTtBQUNuRSxpREFBd0M7QUFDeEMsK0NBQXlEO0FBQzVDLFFBQUEsZ0JBQWdCLEdBQUcsdUJBQXVCLENBQUM7QUFFeEQsTUFBTSxJQUFJLEdBQXVCLElBQUksR0FBRyxFQUFFLENBQUM7QUFLM0MsSUFBYSxLQUFLLEdBQWxCLE1BQWEsS0FBTSxTQUFRLEdBQW1CO0lBQzFDO1FBQ0ksS0FBSyxFQUFFLENBQUM7SUFDWixDQUFDO0NBQ0osQ0FBQTtBQUpZLEtBQUs7SUFEakIsVUFBVSxFQUFFOztHQUNBLEtBQUssQ0FJakI7QUFKWSxzQkFBSztBQU9sQixJQUFhLE1BQU0sR0FBbkIsTUFBYSxNQUFPLFNBQVEsR0FBbUI7SUFDM0M7UUFDSSxLQUFLLEVBQUUsQ0FBQztJQUNaLENBQUM7Q0FDSixDQUFBO0FBSlksTUFBTTtJQURsQixVQUFVLEVBQUU7O0dBQ0EsTUFBTSxDQUlsQjtBQUpZLHdCQUFNO0FBTW5CLFNBQWdCLGFBQWEsQ0FBQyxLQUEwQjtJQUNwRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtRQUNaLE9BQU8sRUFBRSxLQUFLO1FBQ2QsUUFBUSxFQUFFLEtBQUs7S0FDbEIsQ0FBQyxDQUFBO0FBQ04sQ0FBQztBQUxELHNDQUtDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLE1BQTJCO0lBQ3RELElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO1FBQ2IsT0FBTyxFQUFFLE1BQU07UUFDZixRQUFRLEVBQUUsTUFBTTtLQUNuQixDQUFDLENBQUE7QUFDTixDQUFDO0FBTEQsd0NBS0M7QUFPRCxTQUFnQixVQUFVO0lBQ3RC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