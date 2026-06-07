import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <span>🐾</span>
              <span>AdoptMe</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              领养代替购买，给流浪动物一个温暖的家。我们聚合全网领养信息，助你找到心仪的毛孩子。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pets" className="hover:text-white transition-colors">领养中心</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">关于我们</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">注册账号</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white font-semibold mb-3">领养指引</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-default">领养流程</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">领养条件</span></li>
              <li><span className="hover:text-white transition-colors cursor-default">宠物护理知识</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">联系我们</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 admin@adopt.me</li>
              <li>🐦 WeChat: AdoptMe官方</li>
              <li>📍 中国 · 北京</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AdoptMe.com — 领养代替购买 · 用爱终止流浪
        </div>
      </div>
    </footer>
  );
}
