import Hero from "./components/Hero"
import About from "./components/About"
import Experience from "./components/Experience"
import Skills from "./components/Skills"
import Services from "./components/Services"
import Education from "./components/Education"
import Contact from "./components/Contact"
import FloatingNav from "./components/floating-nav"
import QualityStatement from "./components/QualityStatement"
import Badges from "./components/Badges"
import Tools from "./components/Tools"

export default function Home() {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <FloatingNav />
      <Hero />
      <About />
      <QualityStatement />
      <Badges />
      <Tools />
      <Experience />
      <Skills />
      <Services />
      <Education />
      <Contact />
    </main>
  )
}

