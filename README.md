# 用 pnpm 和 monorepo 对大项目进行拆分、子项目相互引用

## workspaces
```
packages:
  - "src/**"
```
下面可以有 gateway, user 等子项目

## 子项目
在 `/src/gateway` 目录下运行 `pnpm init -y`，然后把 `package.json` 里的 `name` 改为 `@project/gateway`。_注意：`@project` 之类的前缀可以随意取，但要统一_

## 公共依赖
> dependencies
```
pnpm i @nestjs/common @nestjs/core @nestjs/platform-express -w
pnpm i reflect-metadata rimraf rxjs -w
```
> devDependencies
```
pnpm i typescript -D -w
```
如果 `package.json` 手动添加了一些依赖，可以直接执行 `pnpm i -w`

## 独有依赖
### gateway
> dependencies
```
pnpm i swagger-ui-express -r --filter @project/gateway
```
> devDependencies
```
todo
```
> 模糊安装
```
pnpm i -r --filter @project/gateway
```
### user
> dependencies
```
pnpm i bcrypt @nestjs/mongoose -r --filter @project/user
```
> devDependencies
```
todo
```
> 模糊安装
```
pnpm i -r --filter @project/user
```
## 子项目依赖
### user
> dependencies
```
pnpm i @project/utils -r --filter @project/user
```

## 一键依赖
### 安装
```
pnpm i
```
### 删除
```
rm -rf node_modules **/*/node_modules
```

## 启动项目
### gateway
在 package.json 的 scripts 里配置 `"start:dev": "echo hello from gateway"`

### user
在 package.json 的 scripts 里配置 `"start:dev": "echo hello from user"`

### 根目录
```
pnpm -C ./src/user start:dev & pnpm -C ./src/gateway start:dev
```

## references
- 用 pnpm 管理 Monorepo 项目 https://zhuanlan.zhihu.com/p/422740629
- 使用 pnpm 构建 Monorepo 项目 https://juejin.cn/post/6964328103447363614
- Communicating with microservices using the gRPC framework
https://wanago.io/2020/11/30/api-nestjs-microservices-grpc-framework/
- gRPC Demo https://github.com/srctian/grpc-demo