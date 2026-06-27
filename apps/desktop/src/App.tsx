import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Widget } from '@/components/widget/Widget'
import { Dashboard } from '@/components/dashboard/Dashboard'

const queryClient = new QueryClient()

function getMode(): 'widget' | 'dashboard' {
  const params = new URLSearchParams(window.location.search)
  return (params.get('mode') as 'widget' | 'dashboard') || 'widget'
}

export default function App() {
  const mode = getMode()

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full flex items-center justify-center">
        {mode === 'widget' ? <Widget /> : <Dashboard />}
      </div>
    </QueryClientProvider>
  )
}
