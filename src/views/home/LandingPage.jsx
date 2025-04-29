// library
import { Link } from "react-router-dom";

// component
import Footer from "../../components/Footer";

// images
import HERO from '../../assets/hero.jpg';

function LandingPage() {
  return (
    <div>
      <div className="p-6">
      <div className="hero bg_style min-h-[80vh] rounded-3xl">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src={HERO}
            className="max-w-lg rounded-lg shadow-2xl" />
          <div>
            <h1 className="text-5xl font-bold text-center lg:text-left">Android Base Fruits And Vegetable Finder Around Magalang!</h1>
            <p className="py-6 text-center lg:text-left">
              Capstone Project At Pampanga State Agricultural University
            </p>
            <div className="text-center lg:text-left">
              <Link to='/register' className="btn btn-medium px-10">Get Started</Link>
            </div>
          </div>
        </div>
      </div>
        <div className="hero py-24">
          <div className="hero-content ">
            <div>
              <h1 className="text-3xl font-bold text-center mb-4">About Us</h1>
              <div className="mockup-code bg_style text-neutral-400 border">
                <pre data-prefix="$"><code>npm i supplier-finder</code></pre>
                <pre data-prefix=">" className="text-default"><code>Initializing...</code></pre>
                <pre data-prefix=">" className="text-warning"><code>installing...</code></pre>
                <pre data-prefix=">" className="text-success"><code>Progress: 0%...</code></pre>
                <pre data-prefix=">" className="text-warning"><code>supplier list...</code></pre>
                <pre data-prefix=">" className="text-success"><code>Progress: 20%...</code></pre>
                <pre data-prefix=">" className="text-warning"><code>supply lookup...</code></pre>
                <pre data-prefix=">" className="text-success"><code>Progress: 40%...</code></pre>
                <pre data-prefix=">" className="text-warning"><code>save to favorites...</code></pre>
                <pre data-prefix=">" className="text-success"><code>Progress: 60%...</code></pre>
                <pre data-prefix=">" className="text-warning"><code>searching...</code></pre>
                <pre data-prefix=">" className="text-success"><code>Progress: 80%...</code></pre>
                <pre data-prefix=">" className="text-warning"><code>mapping...</code></pre>
                <pre data-prefix=">" className="text-success"><code>Progress: 100%...</code></pre>
                <pre data-prefix=">" className="text-success"><code>Completed!</code></pre>
              </div>
              <p className="py-6 text-center">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi labore enim ipsum vel dignissimos saepe tenetur nihil obcaecati. Quia, assumenda.:</p>
              <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical pe-0 lg:pe-24">
                <li>
                  <div className="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  </div>
                  <div className="timeline-start md:text-end mb-10">
                    <time className="font-mono italic">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Suscipit, vitae?</time>
                  </div>
                  <hr/>
                </li>
                <li>
                  <hr />
                  <div className="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  </div>
                  <div className="timeline-end mb-10">
                    <time className="font-mono italic">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex iste laudantium corrupti, consequatur maiores veniam?</time>
                  </div>
                  <hr />
                </li>
                <li>
                  <hr />
                  <div className="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  </div>
                  <div className="timeline-start md:text-end mb-10">
                    <time className="font-mono italic">Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, minus.</time>
                  </div>
                  <hr />
                </li>
                <li>
                  <hr />
                  <div className="timeline-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                  </div>
                  <div className="timeline-end mb-10">
                    <time className="font-mono italic">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor, facilis.</time>
                  </div>
                  <hr />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default LandingPage;
