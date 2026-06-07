import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">关于 AdoptMe</h1>
      <p className="text-lg text-gray-600 text-center mb-12">领养代替购买 · 用爱终止流浪</p>

      <div className="space-y-12">
        {/* Mission */}
        <section className="bg-orange-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 我们的使命</h2>
          <p className="text-gray-700 leading-relaxed">
            AdoptMe 致力于整合互联网上的宠物领养信息，建立一个全面、便捷的宠物领养平台。
            我们相信<strong>领养代替购买</strong>，每一只被领养的动物，都是一次生命的拯救。
            通过聚合全网数据，我们希望打破信息壁垒，让更多人能够找到心仪的毛孩子，
            也让更多流浪动物有机会找到温暖的家。
          </p>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ 平台特色</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: "🌐", title: "全网聚合", desc: "整合微博超话、闲鱼、58同城等多个平台的领养信息，一个网站看遍全网。" },
              { icon: "🔍", title: "精准搜索", desc: "按物种、品种、地点、年龄等条件筛选，快速找到合适的宠物。" },
              { icon: "📝", title: "一键发布", desc: "任何人都可以发布领养信息，帮助身边的流浪动物找到新家。" },
              { icon: "❤️", title: "收藏关注", desc: "收藏感兴趣的宠物，随时查看最新状态。" },
              { icon: "📊", title: "数据透明", desc: "清晰标注信息来源，用户发布 vs 平台抓取，一目了然。" },
              { icon: "🛡️", title: "安全可靠", desc: "实名注册、申请审核机制，保障领养过程的安全和可靠性。" },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🤝 加入我们</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            AdoptMe 是一个开源项目，欢迎所有热爱动物、关心动物福利的朋友参与进来。
            无论是提供技术支持、反馈建议，还是分享身边的领养信息，你的每一份贡献都至关重要。
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            立即加入 →
          </Link>
        </section>
      </div>
    </div>
  );
}
