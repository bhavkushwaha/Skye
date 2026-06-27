import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { InstallSection } from '@/components/landing/InstallSection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div style={{ background: '#050810', minHeight: '100dvh', color: 'white' }}>
      <Hero />
      <Features />
      <InstallSection />
      <Footer />
    </div>
  )
}
