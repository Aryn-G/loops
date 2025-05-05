export default function Forbidden() {
  return (
    <main className="pt-20 flex-1 flex flex-col items-center justify-center">
      <div className="mx-auto h-full flex flex-col md:flex-row gap-3 max-w-prose items-center text-center">
        <p className="text-3xl md:text-8xl font-bold px-5 md:border-r md:border-black">
          401
        </p>
        <div className="px-5 h-full">
          You aren&apos;t authorized to access this resource.
        </div>
      </div>
    </main>
  );
}
