import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SetupForm } from '@/components/forms/setup-form';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SetupPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600">D3TR</h1>
          <p className="text-gray-600 mt-2">初期設定</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">目標を設定しましょう</CardTitle>
          </CardHeader>
          <CardContent>
            <SetupForm userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
