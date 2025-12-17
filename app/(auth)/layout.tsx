export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600">D3TR</h1>
          <p className="text-gray-600 mt-2">飛距離300ydを目指す増量管理</p>
        </div>
        {children}
      </div>
    </div>
  );
}
