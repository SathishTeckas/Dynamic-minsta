"use client"
import React, { useState, useEffect } from 'react';
import eventDatas from '../../../config.js';
import { useRouter } from "next/navigation";
import { FaRegCalendarAlt, FaRegCalendarCheck,FaRegCheckCircle } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import useRegister from '@/utils/useRegister'; 
import useJoinEvent from '@/utils/useJoinEvent';
import useFetchData from '@/utils/useGenerateCSV';
import UseFetchCount from '@/utils/useCount';
import ProgressBar from './progressBar';
interface Event {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  
}


export const Events: React.FC = () => {
  const { push } = useRouter();
  const events: Event[] = eventDatas.map((event: any) => ({
    ...event,
    startTime: new Date(event.startTime),
    endTime: new Date(event.endTime)
  }));

  const [percentage, setPercentage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: string | undefined }>({});
  const { register,loading } = useRegister(); 
  const { fetchUser } = useJoinEvent(); 
  const {fetchCount} = UseFetchCount();
   const {fetchData, loading: fetchingData, error, csvData} = useFetchData();
   
  const handleJoin = async(event : Event)=>{
    if (loading) return;
    console.log("join")
    let now = new Date();
    
      try {
        const response = await fetchUser(event.id);
       
        if (response) {
          if(event.startTime>now){
            alert("The event is not yet started");
          }else{
          console.log("push",response);
  
          push("/event/" + event.id);
         
          }
        } else {
          alert("You need to register for the event before joining.");
        }
      } catch (error) {
        console.error('Error joining event:', error);
        alert("Failed to join event. Please try again later.");
      }
    
  }

  const handleRegister = async (event:Event)=>{
    if (loading) return;
    try{
      const registered = await register(event.id);
      if(!registered){
          alert("failed to registered")
      }else{
        alert("registered")
      }

    }catch(error){
      console.error('Error registering event:', error);
      alert("Failed to register event. Please try again later.");

    }

  }
  
  const handleGenerateCSV = async () => {
    await fetchData();
    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'registrations.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };



  useEffect(() => {
  
    const intervalId = setInterval(async() => {
      const now = new Date();
      const remaining: { [key: string]: string | undefined } = {};
      events.forEach(event => {
        if (event.startTime > now) {
          const diff = event.startTime.getTime() - now.getTime();
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          remaining[event.id] = `Starts in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else if (event.endTime > now) {
          const diff = event.endTime.getTime() - now.getTime();
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          remaining[event.id] = `Ends in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
      });

      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [events]);

  useEffect(() => {
    const fetchEventCount = async () => {
      const count = await fetchCount();
      if (count !== null) {
        const calculatedPercentage = (count / events.length) * 100;
        setPercentage(calculatedPercentage);
      }
    };
    
    fetchEventCount();
  }, [events, fetchCount]);

  const getEventIcon = (event: Event) => {
    const now = new Date();
    return event.startTime > now ? <FaRegCalendarAlt /> : <FaRegCalendarCheck />;
  };

 

  return (
    <main className="pt-20 flex flex-col gap-6 items-center justify-center text-mainText">
      <div className="flex items-center mb-6">
        <h2 className='text-2xl font-semibold mr-4'>Events</h2>
        
        <div className="flex justify-end w-full">
        {/* <div className='w-32 h-32 ml-20' style={{ width: 100, height: 100 }}> */}
      {/* <CircularProgressbar
  value={percentage}
  text={`${percentage}%`}
  styles={buildStyles({
    rotation: 0.25,
    strokeLinecap: 'butt',
    textSize: '16px',
    pathTransitionDuration: 0.5,
    pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
    textColor: 'black',
    trailColor: '#d6d6d6',
    backgroundColor: '#3e98c7',
  })}
/> */}

{/* </div> */}
      </div>
      </div>
      <div className="container mx-auto">
      <ProgressBar value={percentage}/>
      <div className="flex justify-end mb-4 pr-10">
          <button className="bg-green-700 hover:bg-green-400 text-white px-4 py-2 rounded-md mr-2" onClick={handleGenerateCSV}>Generate CSV</button>
        </div>
     
        <div className="flex flex-wrap justify-center gap-4">
          
          {events.map(event => (
            <div key={event.id} id={`card-${event.id}`} className="bg-gray-300 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4 rounded-lg m-2">
              <div className="flex flex-wrap justify-between">
              <div className="text-3xl mb-4">
                {getEventIcon(event)}
              </div>
              <div className="text-3xl mb-4">
                {/* {getRegisteredIcon(event)} */}
              </div>
            </div>

              
              <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
              <p className="text-gray-600 mb-4">ID: {event.id}</p>
              <p className="text-gray-600 mb-4">{timeRemaining[event.id]}</p>
              <div className="flex justify-between">
               {new Date() <= event.endTime && (
                    <button
                        className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-md mr-2"
                        onClick={() => handleJoin(event)}
                        disabled={new Date()> event.endTime}
                      >
                        Join
                      </button>
               )}
                 {new Date() <= event.endTime && (
                <button
                  className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-md"
                  onClick={() => handleRegister(event)}
                  disabled={new Date() >= event.endTime}
                >
                  Register
                </button>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Events;
