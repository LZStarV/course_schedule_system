import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { RpcRegistry } from './rpc.registry';

@Injectable()
export class RpcDiscoveryProvider implements OnApplicationBootstrap {
  constructor(
    @Inject(DiscoveryService)
    private readonly discovery: DiscoveryService,
    @Inject(RpcRegistry)
    private readonly registry: RpcRegistry
  ) {}

  // 自动发现 & 注册：扫描所有 Provider，挑选类名以 Controller 结尾的控制器
  // 规则：公开方法（非生命周期/非私有）按 Domain.Action 注册到 RpcRegistry
  // - Domain：控制器类名去掉 "Controller" 后缀，如 AuthController → Auth
  // - Action：方法名首字母大写，如 login → Login，listForStudent → ListForStudent
  async onApplicationBootstrap() {
    const providers = this.discovery.getProviders();
    for (const wrapper of providers as any[]) {
      const metatype = wrapper.metatype;
      const instance = wrapper.instance;
      if (!metatype || !instance) continue;
      const className = metatype.name as string;
      if (!className || !className.endsWith('Controller'))
        continue;
      if (className === 'AppController') continue;
      const domain = className.slice(0, -10);
      const proto = metatype.prototype;
      for (const key of Object.getOwnPropertyNames(proto)) {
        // 过滤生命周期与私有方法，仅注册公开业务方法
        if (
          key === 'constructor' ||
          key === 'onModuleInit' ||
          key === 'onApplicationBootstrap' ||
          key.startsWith('_')
        )
          continue;
        const fn = instance[key];
        if (typeof fn !== 'function') continue;
        const action =
          key.charAt(0).toUpperCase() + key.slice(1);
        const name = `${domain}.${action}`;
        // 避免重复注册（如存在历史手工注册或生命周期重复调用）
        if (this.registry.has(name)) continue;
        // 将公开方法包装为 handler，入口层透传 params/context
        this.registry.register(
          name,
          async (
            params: Record<string, unknown>,
            context?: Record<string, unknown>
          ) => {
            return await instance[key].call(
              instance,
              params ?? {},
              context
            );
          }
        );
      }
    }
  }
}
