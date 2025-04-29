function LoadingProgress() {
  return (
    <div className="top-0 left-0 z-[999] fixed w-screen h-screen bg-[rgba(0,0,0,0.75)] flex justify-center items-center">
        <span className="loading loading-ring loading-lg text-white"></span>
    </div>
  )
}

export default LoadingProgress;
