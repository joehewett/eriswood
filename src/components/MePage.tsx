import React from 'react';
import Navbar from './Navbar';

const MePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black pt-20">
      <Navbar 
        categoryImage="/landing/bottomlefttext.PNG"
        categoryRoute="/me"
        categoryAlt="Me"
      />
      
      <div className="px-10 max-w-4xl mx-auto py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Photo */}
          <div className="lg:w-1/3 w-full">
            <img 
              src="/coro3.webp" 
              alt="Coro Benavent"
              className="w-full aspect-square object-cover rounded-lg shadow-2xl"
            />
          </div>
          
          {/* Description */}
          <div className="lg:w-2/3 w-full">
            <h1 className="text-4xl font-bold text-white font-handwritten mb-6">
              Actress, Director, Singer
            </h1>
            
            <div className="text-white/90 leading-relaxed space-y-4 text-base">
              <p>
                I am an actress, director and singer (musician) building my career by telling human stories. I was trained as an actress at Corazza, Madrid, and The Bristol Old Vic. I have been creating music and art for 10 years. In my art, I try to bring to life the creativity and humanity that emerges in groups oriented at common objectives. Above all I value the freedom to create, and I believe this can only be done with an open heart.
              </p>
              
              <p>
                In August 2025, I am officially starting a production company with my co-creative partner Gabrielle Torreborre :)
              </p>
              
              <p>
                In July 2025, I directed a narrative music video for one of my songs, &ldquo;SUPERGLUE&rdquo;, a self composed song. The film involves two actors playing a couple in crisis, with two Conservatoire dancers playing their alter egos.
              </p>
              
              <p>
                In June 2025, I worked as the director&rsquo;s assistant on a documentary following shepherds during their 40-day transhumance journey from southern to northern Spain. As the director was from Scotland and didn&rsquo;t speak Spanish, I was their bridge, responsible for gathering local context, orchestrating conversations about this disappearing tradition, and capturing authentic moments.
              </p>
              
              <p>
                In May 2025, I created and produced a music video for &ldquo;Palomitas sin maíz&rdquo;, a song I wrote to my grandmother the day that she passed away. The narrative explored my relationship to her and the other female role models in my life. It was shot on 16mm and starred Dinah Stabb, Gully (a musician), a horse and myself. The 2-day shoot was featured by Kodak, reviewed by Promonews and has been pre-nominated for the Shiny Awards.
              </p>
              
              <p>
                In February 2025, I co-created a concept photoshoot called &lsquo;Sisters, sisters&rsquo; with Gabrielle Torreborre about two sisters reconnecting after a big dispute.
              </p>
              
              <p>
                In December, I organised and performed at one of our many concerts of my band ALAMAYO, where we presented many new songs that are coming out slowly but surely.
              </p>
              
              <p>
                Finally, my happy place is being in the water surfing and have a strong passion for all sorts of sports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MePage;
