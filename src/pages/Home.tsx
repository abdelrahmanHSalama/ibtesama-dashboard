const Home = () => {
  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center h-full p-2 dark:text-white">
        <h1 className="text-2xl font-semibold">👋🏻 Hello!</h1>
        <p>
          This page will allow non-authenticated users to login/register and
          will display an overview of the clinic operations for authenticated
          users.
        </p>
      </div>
    </>
  );
};

export default Home;
