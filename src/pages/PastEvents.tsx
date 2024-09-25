import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShootingStars } from "../../components/ShootingStars";
import { StarsBackground } from "../../components/StarBackground";

gsap.registerPlugin(ScrollTrigger);

interface Event {
  EventName: string;
  Description: string;
  Image: string;
}

const PastEvents: React.FC = () => {
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  const events: Event[] = [
    {EventName: "Hackathon", Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus aperiam nisi officia, impedit fugiat nemo architecto ullam.", Image: "../../public/pastEventsPic.png"},
    {EventName: "Hackathon", Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus aperiam nisi officia, impedit fugiat nemo architecto ullam.", Image: "../../public/pastEventsPic.png"},
    {EventName: "Hackathon", Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus aperiam nisi officia, impedit fugiat nemo architecto ullam.", Image: "../../public/pastEventsPic.png"},
    {EventName: "Hackathon", Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus aperiam nisi officia, impedit fugiat nemo architecto ullam.", Image: "../../public/pastEventsPic.png"},
    {EventName: "Hackathon", Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus aperiam nisi officia, impedit fugiat nemo architecto ullam.", Image: "../../public/pastEventsPic.png"},
    {EventName: "Hackathon", Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus aperiam nisi officia, impedit fugiat nemo architecto ullam.", Image: "../../public/pastEventsPic.png"},
  ];

  useEffect(() => {
    eventRefs.current.forEach((ref, index) => {
      if (ref) {
        const isEven = index % 2 === 0;
  
        // Initial image animation
        gsap.fromTo(
          ref.querySelector("img"),
          {
            x: isEven ? "-150vw" : "150vw",
            opacity: 0,
            rotateZ: isEven ? 50 : -50,
            y: -50,
            scale: 0.6,
          },
          {
            x: 0,
            opacity: 1,
            rotateZ: 0,
            y: 0,
            scale: 1,
            duration: 2.5,
            ease: "elastic.out(1, 0.7)",
            scrollTrigger: {
              trigger: ref,
              start: "top 85%",
              end: "top 50%",
              scrub: true,
              toggleActions: "play none none none",
            },
            onComplete: () => {
              // Continuous floating
              gsap.to(ref.querySelector("img"), {
                y: '+=15',
                rotationZ: isEven ? 5 : -5,
                repeat: -1,
                yoyo: true,
                duration: 5,
                ease: "sine.inOut",
              });
            },
          }
        );
  
        // Parallax effect on image
        gsap.to(ref.querySelector("img"), {
          y: isEven ? "-=30" : "+=30",  // Move up/down while scrolling
          ease: "power1.out",
          scrollTrigger: {
            trigger: ref,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
  
        // Text animations: Stagger fade-in
        const textBlocks = ref.querySelectorAll(".text-block");
        gsap.fromTo(
          textBlocks,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power2.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: ref,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
  
        // Zoom in and blur effect when out of view
        gsap.fromTo(
          ref.querySelector("img"),
          { filter: "blur(5px)", scale: 0.9 },
          {
            filter: "blur(0px)",
            scale: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref,
              start: "top 70%",
              end: "top 30%",
              scrub: true,
            },
          }
        );
      }
    });
  }, []);
  
  
  
  

  return (
    <div className="bg-gradient-to-b from-[#22071b] via-[#190341] to-[#1f021c] relative overflow-x-hidden">
      <StarsBackground className="absolute" starDensity={0.0002} />
      <ShootingStars />
      <div className="text-5xl font-bold">
        <h1 className="bg-gradient-to-b my-10 from-orange-500 to-purple-600 text-transparent bg-clip-text text-center">
          Past Events
        </h1>
      </div>

      <div>
        {events.map((event, index) => {
          const eventNumber = String(index + 1).padStart(2, "0");
          const isEven = (index + 1) % 2 === 0;

          return (
            <div
              ref={(el) => (eventRefs.current[index] = el)}
              className={`mx-auto w-[80%] py-12 grid grid-cols-2`}
              key={index}
            >
              {!isEven && (
                <div className="px-10 my-auto">
                  <div className="px-5 py-1 my-1 bg-gradient-to-r from-red-500 to-orange-600 inline-block text-2xl font-bold rounded-[25px]">
                    {eventNumber}
                  </div>
                  <div className="bg-gradient-to-r my-1 from-red-500 to-orange-600 text-transparent bg-clip-text text-2xl font-bold">
                    {event.EventName}
                  </div>
                  <div className="w-[300px] my-1 text-white">{event.Description}</div>
                </div>
              )}
              <div className="flex justify-center">
                <img
                  className="h-[260px] w-[260px] rounded-lg"
                  src={event.Image}
                  alt="Event"
                />
              </div>
              {isEven && (
                <div className="px-10 my-auto">
                  <div className="float-right">
                    <div className="px-5 py-1 my-1 bg-gradient-to-r from-red-500 to-orange-600 inline-block text-2xl font-bold rounded-[25px]">
                      {eventNumber}
                    </div>
                    <div className="bg-gradient-to-r my-1 from-red-500 to-orange-600 text-transparent bg-clip-text text-2xl font-bold">
                      {event.EventName}
                    </div>
                    <div className="w-[300px] my-1 text-white">{event.Description}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PastEvents;