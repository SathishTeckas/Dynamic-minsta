import CameraComponent from "@/app/camera/page";

export default function Home({ params }: { params: { id: string } }) {
    return(
      
      <div>
            <p className="pt-20 flex flex-col gap-3 items-center  text-mainText">Event {params.id}</p>
            <CameraComponent  />
            </div>
    )
}
