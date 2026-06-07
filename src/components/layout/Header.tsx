"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-orange-600">
          <span className="text-2xl">🐾</span>
          <span>AdoptMe</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            首页
          </Link>
          <Link href="/pets" className="hover:text-orange-600 transition-colors">
            领养中心
          </Link>
          <Link href="/about" className="hover:text-orange-600 transition-colors">
            关于我们
          </Link>
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                我的中心
              </Link>
              {(session.user as { role: string }).role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  管理后台
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm px-4 py-2 rounded-lg border border-orange-300 text-orange-600 hover:bg-orange-50 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                注册
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link href="/" className="block py-2 text-gray-700 hover:text-orange-600" onClick={() => setMobileOpen(false)}>
            首页
          </Link>
          <Link href="/pets" className="block py-2 text-gray-700 hover:text-orange-600" onClick={() => setMobileOpen(false)}>
            领养中心
          </Link>
          <Link href="/about" className="block py-2 text-gray-700 hover:text-orange-600" onClick={() => setMobileOpen(false)}>
            关于我们
          </Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-orange-600" onClick={() => setMobileOpen(false)}>
                我的中心
              </Link>
              <button onClick={() => signOut()} className="block py-2 text-red-500">
                退出登录
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1 text-center py-2 border border-orange-300 text-orange-600 rounded-lg" onClick={() => setMobileOpen(false)}>
                登录
              </Link>
              <Link href="/register" className="flex-1 text-center py-2 bg-orange-500 text-white rounded-lg" onClick={() => setMobileOpen(false)}>
                注册
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
