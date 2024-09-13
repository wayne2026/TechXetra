import { ShootingStars } from "../../components/ShootingStars";

function PastEvents() {

    const events = [
        {EventName: "Hackathon", Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus aperiam nisi officia, impedit fugiat nemo architecto ullam.", Image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6cI51LvrxoqISHcYbGs7aVaWKswEcs8BU0g&s"},
        {EventName: "Hackathon", Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus aperiam nisi officia, impedit fugiat nemo architecto ullam.", Image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6cI51LvrxoqISHcYbGs7aVaWKswEcs8BU0g&s"},
        {EventName: "Hackathon", Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus aperiam nisi officia, impedit fugiat nemo architecto ullam.", Image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6cI51LvrxoqISHcYbGs7aVaWKswEcs8BU0g&s"},
        {EventName: "Hackathon", Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus aperiam nisi officia, impedit fugiat nemo architecto ullam.", Image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6cI51LvrxoqISHcYbGs7aVaWKswEcs8BU0g&s"},
        {EventName: "Hackathon", Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus aperiam nisi officia, impedit fugiat nemo architecto ullam.", Image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6cI51LvrxoqISHcYbGs7aVaWKswEcs8BU0g&s"},
        {EventName: "Hackathon", Description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo minus aperiam nisi officia, impedit fugiat nemo architecto ullam.", Image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6cI51LvrxoqISHcYbGs7aVaWKswEcs8BU0g&s"},
    ]

    return (
      <div className="bg-gradient-to-b from-[#1f021c] to-[#11021A]">
        <ShootingStars />
      <div className="text-5xl font-bold">
    <h1 className="bg-gradient-to-b from-orange-500 to-purple-600 text-transparent bg-clip-text text-center">
        Past Events
    </h1>
</div>

        <div>
        {events.map((event, index) => {
    const eventNumber = String(index + 1).padStart(2, '0');
    const isEven = (index + 1) % 2 === 0;

    return (
        <div 
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
                <img className="h-[260px] w-[260px]" src={event.Image} alt="Sample" />
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
    )
  }
  
  export default PastEvents
  