
编译模板到指定位置

```ts
import { compilerTemplate } from 'iwe7-compiler';
const name = './iwe7-compiler#Iwe7Template';
const outputPath = __dirname;
compilerTemplate(name, outputPath).subscribe();
```
