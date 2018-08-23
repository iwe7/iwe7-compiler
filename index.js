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
    let stop = true;
    return rxjs_1.of(null).pipe(operators_1.filter(() => names.length === 2), operators_1.switchMap(res => {
        return list_dir_file_1.listDir(process.cwd()).pipe(operators_1.filter(res => /node_modules$/.test(res)), 
        // 获取第一个匹配的
        operators_1.take(1), operators_1.map(res => {
            try {
                return node_1.resolve(names[0], {
                    basedir: res
                });
            }
            catch (err) {
                rxjs_1.throwError(err);
            }
        }), operators_1.filter(res => fs_1.existsSync(res)), operators_1.switchMap(res => {
            const rootPath = path_1.dirname(res);
            return rxjs_1.from(Promise.resolve().then(() => require(res))).pipe(operators_1.map(res => res[names[1]]), operators_1.tap(obj => {
                const options = Reflect.getMetadata(exports.TemplateMetadata, obj);
                const input = options.input;
                const content = fs_1.readFileSync(path_1.join(rootPath, input)).toString('utf-8');
                const result = iwe7Compiler(content, exports.rejector().get(obj));
                fs_1.writeFileSync(path_1.join(outputPath, options.output), result);
            }));
        }), operators_1.tap(res => console.log(res)));
    }));
}
exports.compilerTemplate = compilerTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNEJBQTBCO0FBQzFCLDJDQUFxQztBQUNyQyx3Q0FBNkQ7QUFDN0QsMkJBQTZEO0FBQzdELCtCQUFzQztBQUN0QyxvREFBb0Q7QUFDcEQsK0JBQTRDO0FBQzVDLDhDQUFtRTtBQUNuRSxpREFBd0M7QUFFM0IsUUFBQSxnQkFBZ0IsR0FBRyx1QkFBdUIsQ0FBQztBQUV4RCxNQUFNLElBQUksR0FBdUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUszQyxJQUFhLEtBQUssR0FBbEIsTUFBYSxLQUFNLFNBQVEsR0FBbUI7SUFDMUM7UUFDSSxLQUFLLEVBQUUsQ0FBQztJQUNaLENBQUM7Q0FDSixDQUFBO0FBSlksS0FBSztJQURqQixVQUFVLEVBQUU7O0dBQ0EsS0FBSyxDQUlqQjtBQUpZLHNCQUFLO0FBT2xCLElBQWEsTUFBTSxHQUFuQixNQUFhLE1BQU8sU0FBUSxHQUFtQjtJQUMzQztRQUNJLEtBQUssRUFBRSxDQUFDO0lBQ1osQ0FBQztDQUNKLENBQUE7QUFKWSxNQUFNO0lBRGxCLFVBQVUsRUFBRTs7R0FDQSxNQUFNLENBSWxCO0FBSlksd0JBQU07QUFNbkIsU0FBZ0IsYUFBYSxDQUFDLEtBQTBCO0lBQ3BELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO1FBQ1osT0FBTyxFQUFFLEtBQUs7UUFDZCxRQUFRLEVBQUUsS0FBSztLQUNsQixDQUFDLENBQUE7QUFDTixDQUFDO0FBTEQsc0NBS0M7QUFFRCxTQUFnQixjQUFjLENBQUMsTUFBMkI7SUFDdEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUU7UUFDYixPQUFPLEVBQUUsTUFBTTtRQUNmLFFBQVEsRUFBRSxNQUFNO0tBQ25CLENBQUMsQ0FBQTtBQUNOLENBQUM7QUFMRCx3Q0FLQztBQU9ELFNBQWdCLFVBQVU7SUFDdEIsT0FBTyxDQUFDLE1B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