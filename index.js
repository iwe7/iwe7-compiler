"use strict";
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
function Injectable() {
    return (target) => {
        if (_map.has(target)) {
            console.log('已存在类', target);
        }
        else {
            _map.set(target, target);
        }
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
    _map.forEach(m => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEJBQTBCO0FBQzFCLDJDQUFxQztBQUNyQyx3Q0FBbUQ7QUFDbkQsMkJBQTZEO0FBQzdELCtCQUFzQztBQUN0QyxvREFBb0Q7QUFDcEQsK0JBQTRDO0FBQzVDLDhDQUFtRTtBQUNuRSxpREFBd0M7QUFFM0IsUUFBQSxnQkFBZ0IsR0FBRyx1QkFBdUIsQ0FBQztBQUV4RCxNQUFNLElBQUksR0FBa0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQU90QyxTQUFnQixVQUFVO0lBQ3RCLE9BQU8sQ0FBQyxNQUFXLEVBQUUsRUFBRTtRQUNuQixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDL0I7YUFBTTtZQUNILElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzVCO0lBQ0wsQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQVJELGdDQVFDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLGNBQStCO0lBQ3BELE9BQU8sQ0FBQyxNQUFXLEVBQUUsRUFBRTtRQUNuQixPQUFPLENBQUMsY0FBYyxDQUFDLHdCQUFnQixFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUNwRSxDQUFDLENBQUE7QUFDTCxDQUFDO0FBSkQsNEJBSUM7QUFFRCxTQUFnQixZQUFZLENBQUMsTUFBYyxFQUFFLE9BQVk7SUFDckQsTUFBTSxRQUFRLEdBQUcsb0JBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqQyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0IsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUpELG9DQUlDO0FBRVksUUFBQSxRQUFRLEdBQUcsR0FBdUIsRUFBRTtJQUM3QyxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLHlCQUFrQixDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQTtBQUVELFNBQWdCLGdCQUFnQixDQUFDLElBQVksRUFBRSxVQUFrQjtJQUM3RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUNoQixPQUFPLFNBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQ2hCLGtCQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsRUFDaEMscUJBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNaLE9BQU8sdUJBQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQzlCLGtCQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLFdBQVc7UUFDWCxnQkFBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLGVBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNOLElBQUk7Z0JBQ0EsT0FBTyxjQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUNyQixPQUFPLEVBQUUsR0FBRztpQkFDZixDQUFDLENBQUM7YUFDTjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNWLGlCQUFVLENBQUMsR0FBRyxDQUFDLENBQUE7YUFDbEI7UUFDTCxDQUFDLENBQUMsRUFDRixrQkFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsZUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQzlCLHFCQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDWixNQUFNLFFBQVEsR0FBRyxjQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsT0FBTyxXQUFJLHNDQUFRLEdBQUcsR0FBRSxDQUFDLElBQUksQ0FDekIsZUFBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3pCLGVBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDTixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLHdCQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUMzRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUM1QixNQUFNLE9BQU8sR0FBRyxpQkFBWSxDQUFDLFdBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3RFLE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxPQUFPLEVBQUUsZ0JBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMxRCxrQkFBYSxDQUFDLFdBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBQzNELENBQUMsQ0FBQyxDQUNMLENBQUM7UUFDTixDQUFDLENBQUMsRUFDRixlQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQy9CLENBQUE7SUFDTCxDQUFDLENBQUMsQ0FDTCxDQUFDO0FBQ04sQ0FBQztBQXJDRCw0Q0FxQ0MifQ==