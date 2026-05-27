import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient">ReLock</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Intelligently surface problems you need to review
        </p>
      </div>
      <LoginForm />
    </main>
  )
}
