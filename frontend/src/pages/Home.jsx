import Navbar from '../components/site/Navbar';
import Hero from '../components/site/Hero';
import Story from '../components/site/Story';
import Products from '../components/site/Products';
import Trust from '../components/site/Trust';
import Gallery from '../components/site/Gallery';
import About from '../components/site/About';
import HowToOrder from '../components/site/HowToOrder';
import FAQ from '../components/site/FAQ';
import Contact from '../components/site/Contact';
import Footer from '../components/site/Footer';
import FloatingButtons from '../components/site/FloatingButtons';
import CookieBanner from '../components/site/CookieBanner';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Story />
        <Products />
        <Trust />
        <Gallery />
        <About />
        <HowToOrder />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingButtons />
      <CookieBanner />
    </>
  );
}
