# Sanran 前端修改声明

本版本由 sanran.dev 基于 QuantumNous/new-api v1.0.0-rc.51 修改。

修改日期为 2026-11-20。改动性质为前端品牌主题、样式及相应文案和测试。

修改后的完整源码地址为 <https://github.com/1260215278/new-api-sanran>（分支 `sanran-ui`）。

- `web/index.html`、`web/src/styles/{theme-presets,index}.css` 提供 Sanran 亮暗配色、首屏浏览器色、通用组件和页面样式。
- `web/src/context/theme-customization-provider.tsx`、`web/src/lib/theme-customization.ts`、`web/src/components/{config-drawer,theme-switch}.tsx` 设置新访客默认预设并同步浏览器栏配色。
- `web/src/components/layout/components/{header,section-page-layout,footer}.tsx`、`web/src/components/ui/button.tsx` 接入新样式并显示原项目署名及链接。
- `web/src/components/layout/components/footer.tsx` 在原项目署名旁新增七种语言的「源码」链接，在新窗口打开修改后的源码仓库。
- `web/src/features/home/` 在 URL、HTML 和 Markdown 自定义首页内容下方显示共用页脚，缩短 URL iframe 的默认高度，并补充原项目署名和源码链接的回归测试。
- `web/src/features/auth/auth-layout.tsx` 为认证页面添加响应式品牌面板和表单卡片。
- `web/src/features/dashboard/components/` 与 `web/src/features/dashboard/lib/charts.ts` 接入统计项排版、状态色和主题图表配色。
- `web/src/lib/theme-color.ts` 解析图表使用的主题色。
- `web/src/i18n/locales/` 的七种语言补齐主题、认证品牌及署名文案。
- 主题偏好和仪表盘图表测试覆盖默认值、切换持久化与图表配色。

原项目署名及链接保留于界面页脚。原许可及版权声明见 `LICENSE` 和 `NOTICE`。
